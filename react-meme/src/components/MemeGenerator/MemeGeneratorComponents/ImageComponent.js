import CanvasComponent from './CanvasComponent';
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
            currentImage: '',
        }
        this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this);
        this.addPath = this.addPath.bind(this);
        this.addDrawing = this.addDrawing.bind(this);
        this.addImage = this.addImage.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.imageRetrieved = this.imageRetrieved.bind(this)
        this.templateRetrieved = this.templateRetrieved.bind(this)
        this.undoDrawing = this.undoDrawing.bind(this);
        this.clearDrawing = this.clearDrawing.bind(this);
        this.clearImages = this.clearImages.bind(this);
    }

    // When state is being updated
    componentDidUpdate(prevProps) {
        if (this.props.currentTemplate.url !== prevProps.currentTemplate.url) {
            this.loadImage(this.props.currentTemplate.url).then(result => {
                this.setState({
                    currentImage: { ...this.props.currentTemplate, image: result },
                })
            })
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
            images.push(this.loadImage(URL.createObjectURL(file)));
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

    loadImage(url) {
        var result = new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                return resolve(img);
            }
            img.src = url;
        })
        return result;
    }

    imageRetrieved(data){
        this.props.imageRetrieved(data);
    }

    templateRetrieved(data){
        this.props.templateRetrieved(data);
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
                        currentImage={this.state.currentImage}
                        currentName={this.props.currentTemplate.name}
                        inputBoxes={this.props.inputBoxes}
                        imageDimensions={this.props.imageDimensions}
                        retrieveImageTrigger={this.props.retrieveImageTrigger}
                        imageRetrieved={this.imageRetrieved}
                        retrieveTemplateTrigger={this.props.retrieveTemplateTrigger}
                        templateRetrieved={this.templateRetrieved}
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
            </div >)
    }
}

export default ImageComponent;