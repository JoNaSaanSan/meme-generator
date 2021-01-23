import Draggable from 'react-draggable';
import CanvasDraw from 'react-canvas-draw';
const React = require('react');
require('./ImageComponent.css');

class ImageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drawModus: false,
        }
        this.createTextBoxes = this.createTextBoxes.bind(this);
        this.drawMode = this.drawMode.bind(this);
        this.editMode = this.editMode.bind(this);
    }




    // Add Text Boxes depending on the current meme
    createTextBoxes() {
        this.createCanvas();
        return this.props.inputBoxes.map((el, i) =>
            <Draggable bounds="parent"><div key={i} type="text" className="text-box-on-image"> <div type="text" className="text-on-image" style={{ color: this.props.inputBoxes[`${i}`].color }}> {this.props.inputBoxes[i].text} </div> </div></Draggable>
        )
    }

    createCanvas() {
        return (<CanvasDraw
            ref={canvasDraw => (this.canvasSpace = canvasDraw)}
            brushColor="rgba(155,12,60,0.3)"
            imgSrc={this.props.currentMeme.url}
        />)
    }

    drawMode() {
        return (<CanvasDraw
            ref={canvasDraw => (this.canvasSpace = canvasDraw)}
            brushColor="rgba(155,12,60,0.3)"
            imgSrc={this.props.currentMeme.url}
        />)
    }

    editMode() {
        return (<div className="image-container" >
            <img src={this.props.currentMeme.url} onError={i => i.target.src = ''} id="image-template" class="meme-template-image" />
            {this.createTextBoxes()}
        </div>)
    }

    render() {

        return (
            <div class="image-view" id="center-container">
                { this.state.drawModus ? <button onClick={this.editMode} id="edit-button" class="button" > Edit </button> : <button onClick={this.drawMode} id="draw-button" class="button" > Draw </button>}
                <h2 > {this.props.currentMeme.name} </h2>
                <div className="image-display" >
                    <div className="image-container" >
                        <img src={this.props.currentMeme.url} onError={i => i.target.src = ''} id="image-template" class="meme-template-image" />
                        {this.createTextBoxes()}
                    </div></div>
            </div>)
    }
}

export default ImageComponent;