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
                response.json().then(fetchedData => {
                    const drafts = fetchedData.drafts;
                    console.log(fetchedData.drafts)

                    let data = []


                    for (var i = 0; i < drafts.length; i++) {
                        var draft = drafts[i];
                        console.log(draft)
                        const image = 'data:image/png;base64,' + draft.base64;
                        data.push({
                            id: i,
                            name: draft.name,
                            box_count: 2,
                            width: draft.currentMeme.width, //Todo: User width and height from image
                            height: draft.currentMeme.height,
                            url: URL.createObjectURL(image),
                            inputBoxes: draft.inputBoxes,
                            drawPaths: draft.drawPaths,
                            additionalImages: draft.additionalImages,
                            formatType: draft.formatType,
                        });
                    }
                    this.setState({
                        isFetching: false,
                    }, () => this.props.setImagesArray(data, this.state.isFetching))
                })
            })
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
            </div >
        )
    }
}

export default IfServerBase64Component;