import CanvasComponent from './CanvasComponent';
import Canvas2Component from './CanvasComponent';
import Store from '../../../redux/store';
const React = require('react');
require('./ImageComponent.css');


/**
 * This component displays the canvas and any additional UI which is required to save a generated meme
 */
class ImageComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSignedIn: Store.getState().user.isSignedIn,
            downloadImageTrigger: false,
        }
        this.downloadImage = this.downloadImage.bind(this)
        this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this)
    }

    /**
     * Handles download image button presses via a boolean that is passed to the child
     */
    downloadImage() {
        this.setState(prevState => ({ downloadImageTrigger: !prevState.downloadImageTrigger }))
    }

    handleInputBoxesChange(i, eventName, eventValue) {
        this.props.handleInputBoxesChange(i, eventName, eventValue);
    }

    render() {
        //<img src={this.props.currentMeme.url} onError={i => i.target.src = ''} id="image-template" class="meme-template-image" />
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))
        return (
            <div className="image-view" id="center-container">
                <div className="image-container">
                    <h2 > {this.props.currentMeme.name} </h2>
                    <CanvasComponent
                        currentImage={this.props.currentMeme}
                        inputBoxes={this.props.inputBoxes}
                        downloadImageTrigger={this.state.downloadImageTrigger}
                        inputBoxesUpdated={this.props.inputBoxesUpdated}
                        handleInputBoxesChange={this.handleInputBoxesChange} />

                    <div className="button-view" >
                        <button onClick={() => this.props.generateMeme()} id="generate-button" className="button" > Generate Meme with Imgflip </button>
                        {this.state.isSignedIn ?
                            <button onClick={this.saveMeme} id="save-button" className="button" > Save Meme </button> : <button className="button"> Sign in to save </button>}
                        <button onClick={() => this.downloadImage()} className="button">Download Meme!</button>
                    </div>
                </div>
            </div>)
    }
}

export default ImageComponent;