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
            isDrawMode: false,
            downloadImageTrigger: false,
            drawColor: '',
            drawBrushSize: '',
        }
        this.downloadImage = this.downloadImage.bind(this)
        this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this)
        this.addPath = this.addPath.bind(this)
        this.addDrawing = this.addDrawing.bind(this)
        this.addImages = this.addImages.bind(this)
        this.undoDrawing = this.undoDrawing.bind(this);
        this.clearDrawing = this.clearDrawing.bind(this);
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

    addAdditionalImages(image) {
        this.props.additionalImages(image);
    }

    addPath(path) {
        this.props.addPath(path);
    }

    addDrawing(isDraw) {
        this.setState({
            isDrawMode: isDraw,
        })
    }

    undoDrawing() {
        this.props.undoDrawing();
    }

    clearDrawing() {
        this.props.clearDrawing();
    }

    addImages(isAddImage) {

    }

    handleDrawToolChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        //<img src={this.props.currentMeme.url} onError={i => i.target.src = ''} id="image-template" class="meme-template-image" />
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))
        return (
            <div className="image-view" id="center-container">
                <div className="image-container">
                    <h2 > {this.props.currentMeme.name} </h2>
                    {!this.state.isDrawMode ? <button onClick={() => this.addDrawing(true)} id="draw-button" className="button" > Draw </button> :
                        <div>
                            <input type="color" name="drawColor" className="color-input-box" onChange={this.handleDrawToolChange.bind(this)} />
                            <input type="text" placeholder="2" name="drawBrushSize" className="number-input-box" maxLength="1" onChange={this.handleDrawToolChange.bind(this)} />
                            <button onClick={() => this.addDrawing(false)} id="draw-button" className="button" > Size </button>
                            <button onClick={() => this.undoDrawing(false)} id="undo-button" className="button" > Undo </button>
                            <button onClick={() => this.clearDrawing(false)} id="clear-button" className="button" > Clear </button>
                            <button onClick={() => this.addDrawing(false)} id="draw-button" className="button" > Stop Draw </button>
                        </div>}
                    <CanvasComponent
                        currentImage={this.props.currentMeme}
                        inputBoxes={this.props.inputBoxes}
                        downloadImageTrigger={this.state.downloadImageTrigger}
                        inputBoxesUpdated={this.props.inputBoxesUpdated}
                        additionalImages={this.props.additionalImages}
                        drawPaths={this.props.drawPaths}
                        addPath={this.addPath}
                        addAdditionalImages={this.addAdditionalImages}
                        handleInputBoxesChange={this.handleInputBoxesChange}
                        isDrawMode={this.state.isDrawMode}
                        drawBrushSize={this.state.drawBrushSize}
                        drawColor={this.state.drawColor}
                    />

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