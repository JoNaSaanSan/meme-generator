const React = require('react');


// This component fetches an array of images from the server
class IfScreenshotFromUrlComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            inputUrl: '',
        }

        this.fetchImageFromUrl = this.fetchImageFromUrl.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
    }

    // Fetch all images from /samplememes and store them into a state array
    fetchImageFromUrl(url) {
        this.setState({
            isFetching: true
        });
        var tmpUrl;

        if (this.state.inputUrl.indexOf('://') === -1) {
            tmpUrl = 'https://' + this.state.inputUrl
        }

        fetch(url + '?url=' + tmpUrl)
            .then(async response => {

                const data = await response.json();
                const image = 'data:image/png;base64,' + data.base64_img;
                console.log(image)
                fetch(image)
                    .then(res => res.blob()).then(res => {

                        const dimensions = new Promise(function (resolve, reject) {
                            var src = URL.createObjectURL(res);
                            var img = new Image();
                            img.onload = function () {
                                resolve({ width: img.width, height: img.height });
                                URL.revokeObjectURL(src);
                            };
                            img.src = src;
                        });

                        var that = this;
                        dimensions.then(function (dims) {
                            console.log(dimensions.width)
                            var tmpArr = [];
                            tmpArr.push({
                                id: 1,
                                name: that.props.getImagesButtonName,
                                box_count: 2,
                                width: dims.width,
                                height: dims.height,
                                url: URL.createObjectURL(res),
                            })
                            that.setState({
                                isFetching: false
                            }, () =>
                                that.props.setImagesArray(tmpArr, that.state.isFetching))
                        })
                    })

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

            })
            .catch(error => {
                this.setState({
                    errorMessage: error.toString()
                });
                console.error('There was an error!', error);
            });
    }

    /**
    * 
    * @param {event} event 
    * handles URL input change
    * 
    */
    updateUrl(event) {
        try {
            this.setState({
                inputUrl: event.target.value,
                isFetching: true
            })
        }
        catch (e) {
            console.log(e);
        }
    }


    render() {
        return (
            <div>
                <input type="text" id="image-url-input" value={this.state.inputValue} className="input-box" onChange={this.updateUrl} />
                <button onClick={() => this.fetchImageFromUrl(this.props.URL)} id="fetch-button" className="button" > {this.props.getImagesButtonName} </button>
            </div>
        )
    }
}

export default IfScreenshotFromUrlComponent;