import CanvasComponent from './CanvasComponent';
import { loadImage } from '../../../utils/ImageUtils';
import VideoHandlingComponent from './VideoHandlingComponent';
const React = require('react');
require('./ImageComponent.css');


/**
 * This component displays the canvas and any additional UI which is required to save a generated meme
 */
class ImageComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isDrawMode: false,
            drawColor: '',
            drawBrushSize: 2,
            currentTemplate: '',
        }
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
        if (this.props.currentTemplate.url !== prevProps.currentTemplate.url) {
            if (this.props.currentTemplate.formatType === 'image') {
                loadImage(this.props.currentTemplate.url).then(result => {
                    console.log(this.props.currentTemplate)
                    this.setState({
                        currentTemplate: { ...this.props.currentTemplate, image: result },
                    })
                })
            } else if (this.props.currentTemplate.formatType === 'video' || this.props.currentTemplate.formatType === 'gif') {
                this.setState({
                    currentTemplate: { ...this.props.currentTemplate },
                })
            }

        }
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

    /**
     * 
     * @param {*} event 
     * Load added image
     * 
     */
    addImage(event) {
        console.log(event)
        var files = event.target.files;
        var images = [];
        for (var i = 0; i < files.length; ++i) {
            var file = files[i];
            if (!file.type.match('image'))
                continue;
            images.push(loadImage(URL.createObjectURL(file)));
        }

        Promise.all(images).then((result) => {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                this.props.addAdditionalImages({
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
        }).catch((errdims) => {
            console.log(errdims)
        })
    }

    /**
     * 
     * @param {*} image
     * passes image change handling to parent
     *  
     */
    handleImageChange(image) {
        this.props.handleImageChange(image);
    }

    /**
     * 
     * @param {*} event 
     * passes draw tool change handling to parent
     * 
     */
    handleDrawToolChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        return (
            <div className="image-view">
                <div className="canvas-controls">
                    <div className="draw-controls">
                        {!this.state.isDrawMode ? <button onClick={() => this.addDrawing(true)} id="draw-button" className="button" > Draw </button> :
                            <div>
                                <input type="color" name="drawColor" className="color-input-box" onChange={this.handleDrawToolChange.bind(this)} />
                                <input type="text" placeholder="2" name="drawBrushSize" className="number-input-box" maxLength="1" value={this.state.drawBrushSize} onChange={this.handleDrawToolChange.bind(this)} />
                                <button onClick={() => this.undoDrawing()} id="undo-button" className="button" > Undo </button>
                                <button onClick={() => this.clearDrawing()} id="clear-button" className="button" > Clear </button>
                                <button onClick={() => this.addDrawing()} id="draw-button" className="button" > Stop Draw </button>
                            </div>}
                    </div>
                    <h2 > {this.props.currentTemplate.name} </h2>
                    <div className="image-controls">
                        <div id="upload-button" className="button" >
                            <label htmlFor="additional-image-upload">
                                Add Image</label></div>
                        <input type="file" id="additional-image-upload" onChange={this.addImage} multiple />
                        <button onClick={() => this.clearImages()} id="clear-button" className="button" > Clear Images </button>
                    </div>
                </div>
                <div className="canvas-view">
                    <CanvasComponent
                        currentTemplate={this.state.currentTemplate}
                        currentName={this.props.currentTemplate.name}
                        inputBoxes={this.props.inputBoxes}
                        imageDimensions={this.props.imageDimensions}
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
                <VideoHandlingComponent
                    currentTemplate={this.state.currentTemplate}
                    canvasWidth={this.props.canvasWidth}
                    canvasHeight={this.props.canvasHeight} />
            </div >)
    }
}

export default ImageComponent;