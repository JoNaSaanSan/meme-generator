import { fabric } from 'fabric';
import { findDOMNode } from 'react-dom'
const React = require('react');
require('./CanvasComponent.css');

// Convert an image to data urls
function getBase64Image(image) {
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
  }
  ctx.drawImage(image, 0, 0);
  let dataUrl = canvas.toDataURL("image/png")
  console.log(dataUrl)
  return dataUrl;
}

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgLoaded: false,
      drawModus: false,
      currentImageBase64: null,
      curretnDrawingBase64: null,
      canvasDimensions: {
        canvasWidth: 0,
        canvasHeight: 0,
        canvasWrH: 1,
        keepRatio: false,
      },
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

      canvas: null
    }
    this.createTextBoxes = this.createTextBoxes.bind(this);
    this.editMode = this.editMode.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Called when window is loaded
  componentDidMount() {
  /*  var can = new fabric.Canvas("canvas", {
      backgroundColor: "#000",
      selection: true
    });

    this.setState({
      canvas: can,
    })
*/

  
  }

  // When state is being updated
  componentDidUpdate(prevProps) {
    var text1 = new fabric.Text("SOME TEXT", {
      left: 160,
      top: 270,
      fill: "#fff"
    });
//    this.state.canvas.add(text1);

//    this.state.canvas.width = this.props.currentImage.width;
 //   this.state.canvas.height = this.props.currentImage.height;
  

     
    if (this.props.currentImage.url !== prevProps.currentImage.url) {
      let tmpArr = [];
      let tmpPosX = [];
      let tmpPosY = [];
      this.props.inputBoxes.map((el, i) => {
        tmpArr[i] = false;
        tmpPosX[i] = this.props.inputBoxes[i].textPosX;
        tmpPosY[i] = this.props.inputBoxes[i].textPosY;
        console.log(tmpPosX[i] + "positions" + tmpPosY[i])
      })

      console.log(this.props.currentImage)

      // Create Base Image
      this.loadImage(this.props.currentImage.url).then(result =>
        this.setState({
          currentImageBase64: result,
          textBoxes: this.props.inputBoxes.length,
          isDragging: tmpArr,
          textPosX: tmpPosX,
          textPosY: tmpPosY,
          canvasDimensions: { canvasHeight: 400, canvasWidth: 400, canvasWrH: (this.props.currentImage.width / this.props.currentImage.height), keepRatio: false }
        })
      )
    }

    if (prevProps.downloadImageTrigger !== this.props.downloadImageTrigger) {
      this.convertSvgToImage(this.props.downloadImageState);
    }
  }

  // Handle Drag State
  getStateObj = (e, type) => {

    let rect;

    // assigns rect a DOMRect object of the image
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
    if (this.props.inputBoxes !== undefined) {
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
    } else {
      return;
    }
  }


  // Handle Draw
  draw() {

    console.log("Draw");
    var canvas = document.createElement("canvas");
    canvas.width = this.state.canvasDimensions.canvasWidth;
    canvas.height = this.state.canvasDimensions.canvasHeight;


    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(75, 50);
      ctx.lineTo(100, 75);
      ctx.lineTo(100, 25);
      ctx.fill();
      let dataUrl = canvas.toDataURL("image/png")
      console.log(dataUrl)
      return dataUrl;
    }
  }

  // Load Image
  loadImage(imgUrl) {
    var result = new Promise((resolve, reject) => {
      var img = new Image();
      // set attributes and src 
      img.setAttribute('crossOrigin', 'anonymous'); //
      img.src = imgUrl;

      img.onload = function () {
        resolve(getBase64Image(img));
      };
      img.onerror = reject;
    });
    return result;
  }




  changeMode() {
    this.setState(prevState => ({ drawModus: !prevState.drawModus }))
    if (this.state.drawModus) {
      const base64 = this.draw();
      this.setState({
        drawModus: false,
        currentDrawingBase64: base64,
      }
      )
    }
  }

  drawMode() {
    if (this.state.drawModus) {
      const base64 = this.draw();
      this.setState({
        drawModus: false,
        currentDrawingBase64: base64,
      }
      )
    }
  }


  // Controls of canvas
  canvasSettings() {

    return (<div className="canvas-settings-container" >
      <input type="number" placeholder="width" name="canvasWidth" className="width-input-box" min="1" max="1000" defaultValue="400" onChange={e => this.handleChange(e)} />
      <input type="number" placeholder="height" name="canvasHeight" className="height-input-box" min="1" max="1000" defaultValue="400" onChange={e => this.handleChange(e)} />
    </div>
    )
  }

  // Handle Events when Text or Color Inputs changed and store it in the inputBoxesStates
  handleChange(event) {
    console.log(event.target.name + ": " + event.target.value)


    this.setState({
      canvasDimensions: Object.assign(this.state.canvasDimensions, { [event.target.name]: event.target.value })
    });
  }



  // Display Canvas
  showCanvas() {
    return (<div className="canvas-container" >
      {this.editMode()}
      {this.resizers()}
    </div>
    )
  }


  addImages(image) {


  }



  // Edit Mode is the mode where the text can be dragged
  editMode() {
    var wrh = this.state.canvasDimensions.canvasWrH;
    var newWidth = this.state.canvasDimensions.canvasWidth;
    var newHeight = this.state.canvasDimensions.canvasHeight;


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
        id="svg_ref"
        height={newHeight}
        width={newWidth}
        ref={element => { this.svgRef = element }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="canvasSvg">
        <image
          ref={element => { this.imageRef = element }}
          xlinkHref={this.state.currentImageBase64}
          height={newHeight}
          width={newWidth}
          className="meme-image"
        />
        <image
          xlinkHref={this.state.currentDrawingBase64}
          height={newHeight}
          width={newWidth}
        />
        {this.createTextBoxes()}

      </svg>
    )
  }



  // Donwload Meme as png
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

  resizers() {


  }


  render() {

    return (
      <div>
        {this.state.drawModus ? <button onClick={this.changeMode} id="change-mode-button" className="button" > Edit </button> : <button onClick={this.changeMode} id="change-mode-button" class="button" > Draw </button>}
        {this.canvasSettings()}
        <div id="canvas-container">
      
        </div>
        {this.showCanvas()}
      </div>
    )
  }
}




export default CanvasComponent;
