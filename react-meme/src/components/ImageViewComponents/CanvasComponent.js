import Draggable from 'react-draggable';
import CanvasDraw from "react-canvas-draw";
import Immutable from 'immutable';
import { findDOMNode } from 'react-dom'
const React = require('react');
require('./CanvasComponent.css');

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgLoaded: false,
      drawModus: false,
      currentImagebase64: null,
      textBoxes: 0,
      isDragging: false,
      isDrawing: false,
      textPosX: '',
      textPosY: '',
      mousePosX: '',
      mousePosY: '',
      prevMousePosX: '',
      prevMousePosY: '',
      color: '#000000',
    }
    this.createTextBoxes = this.createTextBoxes.bind(this);
    this.editMode = this.editMode.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }


  // Handle Drag State
  getStateObj = (e, type) => {

    let rect;

    if (this.imageRef !== null) {
      rect = this.imageRef.getBoundingClientRect();
    }

    // Calculate new position of text
    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;

    // Create tmp arrays for the new states
    let tmpisDragging = this.state.isDragging;
    let tmpPosX = this.state.textPosX;
    let tmpPosY = this.state.textPosY;

    // Change position of selected text
    for (var x = 0; x < this.state.textBoxes; x++) {
      if (type === "text_" + x) {
        tmpisDragging[x] = true
        tmpPosX[x] = xOffset + 'px';
        tmpPosY[x] = yOffset + 'px';
      }
    }

    //  Make new object with new values
    return {
      isDragging: tmpisDragging,
      textPosX: tmpPosX,
      textPosY: tmpPosY,
    }
  }

  // Handle deselection of text
  handleMouseUp = (event) => {
    // Create temp array 
    let tmpisDragging = [];
    for (var x = 0; x < this.state.textBoxes; x++) {
      tmpisDragging[x] = false;
    }

    // Set isDragging state of all text to false
    this.setState({
      isDragging: tmpisDragging,
      isDrawing: false,
    });
  }


  // Handle Text selection
  handleMouseDown = (e, type) => {
    if (this.state.drawModus) {


    } else {
      const stateObj = this.getStateObj(e, type);
      document.addEventListener('mousemove', (event) => this.handleMouseMove(event, type));
      this.setState({
        ...stateObj
      })
    }
  }

  // Handle Text dragging
  handleMouseMove = (e, type) => {
    if (this.state.drawModus) {

    } else {
      for (var x = 0; x < this.state.textBoxes; x++) {
        if (this.state.isDragging[x]) {
          let stateObj = {};
          if (type === "text_" + x) {
            stateObj = this.getStateObj(e, type);
          }
          this.setState({
            ...stateObj
          });
        }
      }
    }
  };

  // Add Text Boxes depending on the current meme
  createTextBoxes() {
    const textStyle = {
      textTransform: "uppercase",
      stroke: "#000",
      userSelect: "none",
    }
    return this.props.inputBoxes.map((el, i) =>
      <text
        key={i}
        style={{ ...textStyle, zIndex: this.state.isDragging[i] ? 4 : 1, fill: this.props.inputBoxes[i].fontColor, fontFamily: this.props.inputBoxes[i].fontFamily, fontSize: this.props.inputBoxes[i].fontSize }}
        x={this.state.textPosX[i]}
        y={this.state.textPosY[i]}
        dominantBaseline="middle"
        textAnchor="middle"
        onMouseDown={event => this.handleMouseDown(event, `text_${i}`)}
        onMouseUp={event => this.handleMouseUp(event, `text_${i}`)}
      >{this.props.inputBoxes[i].text} </text>
    )
  }

  getBase64Image(imgUrl) {

    console.log(imgUrl)

    var result = new Promise((resolve, reject) => {

      var img = new Image();
      // set attributes and src 
      img.setAttribute('crossOrigin', 'anonymous'); //
      img.src = imgUrl;

      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dataUrl = canvas.toDataURL("image/png")
        resolve(dataUrl);
      };
      img.onerror = reject;
    });
    return result;
  }

  // Called when window is loaded
  componentDidMount() {

  }

  // When state is being updated
  componentDidUpdate(prevProps) {

    if (this.props.currentImage.url !== prevProps.currentImage.url) {
      let tmpArr = [];
      let tmpPosX = [];
      let tmpPosY = [];
      this.props.inputBoxes.map((el, i) => {
        tmpArr[i] = false;
        tmpPosX[i] = "50%";
        tmpPosY[i] = 10 + i * 20 + "%";
      })

      // Create Base Image
      this.getBase64Image(this.props.currentImage.url).then(result =>
        this.setState({
          currentImagebase64: result,
          textBoxes: this.props.inputBoxes.length,
          isDragging: tmpArr,
          textPosX: tmpPosX,
          textPosY: tmpPosY,
        })
      )
    }

    if (prevProps.downloadImageTrigger !== this.props.downloadImageTrigger) {
      this.convertSvgToImage(this.props.downloadImageState);
    }
  }



  changeMode() {
    this.setState(prevState => ({ drawModus: !prevState.drawModus }))
  }

  drawMode() {
    if (this.state.drawModus) {


    }

  }

  showCanvas(currentImage) {
    return (<div className="canvas-container" >
      {this.editMode(currentImage)}
    </div>
    )
  }

  convertSvgToImage = () => {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function () {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }



  // Edit Mode is the mode where the text can be dragged
  editMode(currentImage) {
    var wrh = currentImage.width / currentImage.height;
    var newWidth = currentImage.width;
    var newHeight = currentImage.height;
    if (newWidth > 400) {
      newWidth = 400;
      newHeight = newWidth / wrh;
    }

    if (newHeight > 400) {
      newHeight = 400;
      newWidth = newHeight * wrh;
    }

    return (
      <svg
        width={newWidth}
        id="svg_ref"
        height={newHeight}
        ref={el => { this.svgRef = el }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <image
          ref={el => { this.imageRef = el }}
          xlinkHref={this.state.currentImagebase64}
          height={newHeight}
          width={newWidth}
        />
        {this.createTextBoxes()}
       
      </svg>
    )
  }




  render() {

    return (
      <div>
        {this.state.drawModus ? <button onClick={this.changeMode} id="change-mode-button" className="button" > Edit </button> : <button onClick={this.changeMode} id="change-mode-button" class="button" > Draw </button>}
        {this.showCanvas(this.props.currentImage)}
      </div>
    )
  }
}




export default CanvasComponent;
