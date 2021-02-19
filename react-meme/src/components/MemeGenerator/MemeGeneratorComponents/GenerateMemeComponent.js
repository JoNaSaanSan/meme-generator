import Store from '../../../redux/store';
import { b64toBlob } from '../../../utils/imageUtils';
import { retrieveImage } from '../../../utils/canvasUtils';
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
} from "react-share";
const React = require('react');

class GenerateMemeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            isSignedIn: Store.getState().user.isSignedIn,
        }
    }

    componentDidMount() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))

    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props.memeCreationEvent !== prevProps.memeCreationEvent) {
            if (this.props.memeCreationEvent.target.name === "imgFlipGenerate") {
                this.generateMemeImageFlip();
            }

            if (this.props.memeCreationEvent.target.name === "download") {
                this.downloadImage();
            }
            if (this.props.memeCreationEvent.target.name === "publish") {
                this.publishMeme()
            }
            if (this.props.memeCreationEvent.target.name === "save") {
                this.saveDraft();
            }
            if (this.props.memeCreationEvent.target.name === "share") {
                this.shareMeme();
            }
        }
    }

    /**
     * Handles download image button presses via a boolean that is passed to the child
     */
    downloadImage() {
        retrieveImage('all', this.props.canvasWidth, this.props.canvasHeight).then((imageData) => {
            let canvasdata = imageData.replace("image/png", "image/octet-stream");
            const a = document.createElement("a");
            a.download = this.props.currentTemplate.name + '.png';
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        })
    }

    publishMeme() {
        this.publishImage();
    }

    publishImage = () => {
        return new Promise((resolve, reject) => {
            retrieveImage('all', this.props.canvasWidth, this.props.canvasHeight).then((imageData) => {
                var object2Publish = {};
                object2Publish.title = this.props.currentTemplate.name;
                object2Publish.base_64 = imageData;
                object2Publish.visibility = this.props.memeVisibility;

                // Title
                // Token
                // Base64
                // unlisted private Public

                console.log(object2Publish)
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': this.state.accessToken
                    },
                    body: JSON.stringify(object2Publish)
                };
                fetch(this.props.URL + '/memes/publishMeme', requestOptions)
                    .then(async response => {
                        const data = await response.json();
                        resolve(data);
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
            })
        })
    }

    /**
     * Sends a Post request to the server with the current meme state and etc
     */
    saveDraft() {
        retrieveImage('background', this.props.canvasWidth, this.props.canvasHeight).then((imageData) => {
            var object2Save = {};
            object2Save.title = this.props.currentTemplate.name;
            object2Save.currentMeme = this.props.currentTemplate;
            object2Save.base_64 = imageData;
            object2Save.inputBoxes = this.props.inputBoxes;
            object2Save.drawPaths = this.props.drawPaths;
            object2Save.additionalImages = this.props.additionalImages;

            console.log(object2Save)

            // POST request using fetch with error handling

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.state.accessToken
                },
                body: JSON.stringify(object2Save)
            };
            fetch(this.props.URL + '/memes/saveDraft', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log(data);
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
        })
    }




    shareMeme() {
        console.log("share")
        this.publishImage().then(data => {
            
        });
      /*  retrieveImage('background', this.props.canvasWidth, this.props.canvasHeight).then((imageData) => {
            const base64ImageData = imageData;
            const contentType = 'image/png';

            const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: contentType });
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, '_blank');
            // const file = URL.createObjectURL(b64toBlob(imageData));
            // console.log(file)
            //<Route exact path=`/product/${item.id}` component={Product} />
            //this.setState(prevState => ({ downloadImageTrigger: !prevState.downloadImageTrigger }))
        })*/
    }

    /**
     * 
     * Sends Post request to server with enough data to generate a meme via image flip and open another tab which displays the meme
     * 
     */
    generateMemeImageFlip() {
        var object2Generate = {};
        object2Generate.id = this.props.currentTemplate.id;
        object2Generate.inputBoxes = this.props.inputBoxes

        console.log(object2Generate)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object2Generate)
        };
        fetch(this.props.URL + '/memes/generateMeme', requestOptions)
            .then(async response => {
                const data = await response.json();
                console.log(data);
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                var tmp = {};
                tmp.url = data.data.url;
                window.open(tmp.url, "_blank")


            })
            .catch(error => {
                this.setState({
                    errorMessage: error.toString()
                });
                console.error('There was an error!', error);
            });
    }





    render() {
        const shareUrl = 'http://github.com';
        const title = 'GitHub';

        return <div> 
            <div id="share" className="modal-window">
                <div>
                    <a href="/#" title="Close" id="share-window-close" className="modal-close">Close</a>
                    <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        className="Demo__some-network__share-button"
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton></div>
            </div>
        </div>


    }

}

export default GenerateMemeComponent;