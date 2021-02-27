import Store from '../../../../redux/store';
import { b64toBlob } from '../../../../utils/ImageUtils';
const React = require('react');

// This component fetches an array of images from the server
class IfDraftComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            inputUrl: '',
            accessToken: null,
        }
        this.fetchImageFromUrl = this.fetchImageFromUrl.bind(this);
    }

    // Fetch all images from /samplememes and store them into a state array
    fetchImageFromUrl(url) {


        this.setState({
            isFetching: true
        });

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
                    try {
                        const drafts = fetchedData.drafts;
                        console.log(fetchedData)

                        let data = []


                        for (var i = 0; i < drafts.length; i++) {
                            var draft = drafts[i];
                            console.log(draft)

                            var base64result = draft.base64.split(',');
                            if (base64result[1] === null || base64result[1] === '')
                                continue;

                            data.push({
                                id: 0,
                                name: draft.name,
                                box_count: 2,
                                width: draft.currentMeme.width, //Todo: User width and height from image
                                height: draft.currentMeme.height,
                                url: URL.createObjectURL(b64toBlob(base64result[1], base64result[0])),
                                inputBoxes: draft.inputBoxes || [],
                                drawPaths: draft.drawPaths || [],
                                additionalImages: draft.additionalImages || [],
                                formatType: draft.fileType,
                            });

                        }
                        this.setState({
                            isFetching: false,
                        }, () => this.props.setImagesArray(data, this.state.isFetching))
                    } catch (e) {
                        console.log(e)
                    }
                })
            })
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

export default IfDraftComponent;