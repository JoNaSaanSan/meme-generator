import Store from '../../../redux/store';
const React = require('react');

class GenerateMemeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            isSignedIn: Store.getState().user.isSignedIn,
        }

        this.shareMeme = this.shareMeme.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
        this.generateMemeImageFlip = this.generateMemeImageFlip.bind(this);
    }

    componentDidMount() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))

    }


    componentDidUpdate(prevProps, prevState) {
        if(this.props.memeCreationEvent !== prevProps.memeCreationEvent){
            if (this.props.memeCreationEvent.target.name === "imgFlipGenerate") {
                this.generateMemeImageFlip();
            }

            if (this.props.memeCreationEvent.target.name === "download") {
                this.props.retrieveImage();
            }
            if (this.props.memeCreationEvent.target.name === "publish") {
                this.props.retrieveImage();
            }
            if (this.props.memeCreationEvent.target.name === "save") {
                this.props.retrieveTemplate();
            }
        }
        if (this.props.imageData !== prevProps.imageData) {

            switch (this.props.memeCreationEvent.target.name) {
                case 'download':
                    //download
                    this.downloadImage();
                    break;
                case 'publish':
                    this.publishMeme()
                    break;
                case 'share':

                    break;
                default:
            }
        }
        if (this.props.templateData !== prevProps.templateData) {
            console.log("template")
            if (this.props.memeCreationEvent === 'save') {
                this.saveDraft();
            }
        }
    }

    /**
     * Handles download image button presses via a boolean that is passed to the child
     */
    downloadImage() {

        let canvasdata = this.props.imageData.replace("image/png", "image/octet-stream");
        const a = document.createElement("a");
        a.download = this.props.currentTemplate.name + '.png';
        a.href = canvasdata;
        document.body.appendChild(a);
        a.click();
    }

    publishMeme() {
        var object2Publish = {};
        object2Publish.title = this.props.currentTemplate.name;
        object2Publish.base_64 = this.props.imageData;
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
    }

    /**
     * Sends a Post request to the server with the current meme state and etc
     */
    saveDraft() {
        var object2Save = {};
        object2Save.title = this.props.currentTemplate.name;
        object2Save.currentMeme = this.props.currentTemplate;
        object2Save.base_64 = this.props.templateData;
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

    }

    shareMeme() {
        //this.setState(prevState => ({ downloadImageTrigger: !prevState.downloadImageTrigger }))
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
        return null;
    }

}

export default GenerateMemeComponent;