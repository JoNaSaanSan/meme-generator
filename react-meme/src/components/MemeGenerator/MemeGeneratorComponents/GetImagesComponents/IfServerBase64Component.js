import Store from '../../../../redux/store';
import { getImageDimensions } from '../../../../utils/ImageUtils';
const React = require('react');

// This component fetches an array of images from the server
class IfServerBase64Component extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            inputUrl: '',
            accessToken: null,
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

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.state.accessToken,
            },
        };

        fetch(url, requestOptions)
            .then(async response => {

                const data = await response.json();
                const drafts = data.drafts;

                let dimensions = []
                for (var i = 0; i < drafts.length; ++i) {

                    const draft = drafts[i];
                    let dim;
                    const formatType = getFormat(draft.currentmeme.formatType);
                    console.log(formatType)
                    if (formatType === 'image' || formatType === 'gif') {
                        dim = getImageDimensions(draft);
                    } else if (formatType === 'video') {
                        dim = getVideoDimensions(draft);
                    } else {
                        return
                    }
                    console.log(dim)

                    dimensions.push(dim);

                    try {
                        this.uploadImagesToServer(file);
                    } catch (e) {
                        console.log(e)
                    }
                }

                Promise.all(dimensions).then((dims) => {
                    let data = []
                    const image = 'data:image/png;base64,' + data.base64_img;
                    const inputBoxes = data.inputBoxes;
                    const drawPaths = data.drawPaths;
                    const additionalImages = data.additionalImages;
                    const currentMeme = data.currentMeme;
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        const formatType = getFormat(file.name);
                        data.push({
                            id: i,
                            name: file.name,
                            box_count: 2,
                            width: dims[i].width, //Todo: User width and height from image
                            height: dims[i].height,
                            url: URL.createObjectURL(file),
                            inputBoxes: inputBoxes,
                            drawPaths: drawPaths,
                            additionalImages: additionalImages,
                            formatType: formatType,
                        });
                    }
                    this.setState({
                        isFetching: false,
                    }, () => this.props.setImagesArray(data, this.state.isFetching))
                }).catch(function (errdims) {
                    console.log(errdims)
                })

            }) * /

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
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))

    return (
        <div>
            <button onClick={() => this.fetchImageFromUrl(this.props.URL)} id="fetch-button" className="button" > {this.props.getImagesButtonName} </button>
        </div>
    )
}
}

export default IfServerBase64Component;