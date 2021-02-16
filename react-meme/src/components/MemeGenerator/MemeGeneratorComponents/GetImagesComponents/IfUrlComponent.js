const React = require('react')
// This component enables the user to upload images from the local device
class IfUrlComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isFetching: false,
            inputUrl: '',
        }

        this.submitUrl = this.submitUrl.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
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

    /**
     * Creates an image object and pushes that object to an array
     */
    submitUrl() {

        const dimensions = new Promise((resolve, reject) => {
            var src = this.state.inputUrl;
            var img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = src;
        });

        dimensions.then((dims) => {
            console.log(dimensions.width)
            var tmpArr = [];
            tmpArr.push({
                id: 1,
                name:'URL',
                box_count: 2,
                width: dims.width,
                height: dims.height,
                url: this.state.inputUrl,
            })
            this.setState({
                isFetching: false
            }, () =>
            this.props.setImagesArray(tmpArr, this.state.isFetching))
        })

    }


    render() {
        return (
            <div>
                <input type="text" id="image-url-input" value={this.state.inputValue} className="input-box" onChange={this.updateUrl} />
                <button id="image-url-input-button" className="button" onClick={this.submitUrl}> Get Image from URL </button>
            </div>
        );
    }
}

export default IfUrlComponent