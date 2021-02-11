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
            drawBrushSize: 2,
            currentImage: '',
        }
        this.downloadImage = this.downloadImage.bind(this);
        this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this);
        this.addPath = this.addPath.bind(this);
        this.addDrawing = this.addDrawing.bind(this);
        this.addImage = this.addImage.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.undoDrawing = this.undoDrawing.bind(this);
        this.clearDrawing = this.clearDrawing.bind(this);
        this.clearImages = this.clearImages.bind(this);
    }

    // When state is being updated
    componentDidUpdate(prevProps) {
        if (this.props.currentMeme.url !== prevProps.currentMeme.url) {
            this.loadImage(this.props.currentMeme.url).then(result => {
                this.setState({
                    currentImage: { ...this.props.currentMeme, image: result },
                })
            })
        }
    }


    /**
     * Handles download image button presses via a boolean that is passed to the child
     */
    downloadImage() {
        this.setState(prevState => ({ downloadImageTrigger: !prevState.downloadImageTrigger }))
    }

    handleInputBoxesChange(i, event) {
        this.props.handleInputBoxesChange(i, event);
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

    clearImages() {
        this.props.clearImages();
    }

    addImage(event) {

        console.log(event)
        var files = event.target.files;
        var images = [];
        for (var i = 0; i < files.length; ++i) {
            var file = files[i];
            if (!file.type.match('image'))
                continue;
            images.push(this.loadImage(URL.createObjectURL(file)));
        }

        var that = this;
        Promise.all(images).then(function (result) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                that.props.addAdditionalImages({
                    id: i,
                    name: file.name,
                    posX: 100,
                    posY: 50,
                    width: result[i].width / 10,
                    height: result[i].height / 10,
                    url: URL.createObjectURL(file),
                    image: result[i],
                });

                console.log(file)
            }
        }).catch(function (errdims) {
            console.log(errdims)
        })


    }

    handleImageChange(image) {
        this.props.handleImageChange(image);
    }

    handleDrawToolChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    loadImage(url) {
        var result = new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = function () {
                return resolve(img);
            }
            img.src = url;
        })
        return result;
    }


    render() {
        //<img src={this.props.currentMeme.url} onError={i => i.target.src = ''} id="image-template" class="meme-template-image" />
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))
        return (
            <div className="image-view">

                <div className="canvas-controls">
                    <div className="draw-controls">
                        {!this.state.isDrawMode ? <button onClick={() => this.addDrawing(true)} id="draw-button" className="button" > Draw </button> :
                            <div>
                                <input type="color" name="drawColor" className="color-input-box" onChange={this.handleDrawToolChange.bind(this)} />
                                <input type="text" placeholder="2" name="drawBrushSize" className="number-input-box" maxLength="1" value={this.state.drawBrushSize} onChange={this.handleDrawToolChange.bind(this)} />
                                <a onClick={() => this.undoDrawing()} id="undo-button" className="button" > Undo </a>
                                <a onClick={() => this.clearDrawing()} id="clear-button" className="button" > Clear </a>
                                <a onClick={() => this.addDrawing()} id="draw-button" className="button" > Stop Draw </a>
                            </div>}
                    </div>

                    <div className="image-controls">
                        <div id="upload-button" className="button" >
                            <label for="additional-image-upload">
                                Add Image</label></div>
                        <input type="file" id="additional-image-upload" onChange={this.addImage} multiple />
                        <a onClick={() => this.clearImages()} id="clear-button" className="button" > Clear Images </a>
                    </div>
                </div>
                <h2 > {this.props.currentMeme.name} </h2>
                <div className="canvas-view">
                    <CanvasComponent
                        currentImage={this.state.currentImage}
                        currentName={this.props.currentMeme.name}
                        inputBoxes={this.props.inputBoxes}
                        imageDimensions={this.props.imageDimensions}
                        downloadImageTrigger={this.state.downloadImageTrigger}
                        inputBoxesUpdated={this.props.inputBoxesUpdated}
                        additionalImages={this.props.additionalImages}
                        handleImageChange={this.handleImageChange}
                        handleInputBoxesChange={this.handleInputBoxesChange}
                        drawPaths={this.props.drawPaths}
                        addPath={this.addPath}
                        isDrawMode={this.state.isDrawMode}
                        drawBrushSize={this.state.drawBrushSize}
                        drawColor={this.state.drawColor}
                        canvasWidth={this.props.canvasWidth}
                        canvasHeight={this.props.canvasHeight}
                    />
                </div>

                <div className="button-view" >
                    <button onClick={() => this.props.generateMeme()} id="generate-button" className="button" > Generate Meme with Imgflip </button>
                    {this.state.isSignedIn ?
                        <button onClick={this.saveMeme} id="save-button" className="button" > Save Meme </button> : <button className="button"> Sign in to save </button>}
                    <button onClick={() => this.downloadImage()} className="button">Download Meme!</button>
                </div>
            </div >)
    }
}

export default ImageComponent;