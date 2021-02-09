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

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(inputText, fontSize, fontFamily) {
  // re-use canvas object for better performance
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var font = fontSize + "px " + fontFamily;
  context.font = font;
  var textWidth = context.measureText(inputText).width;
  return Math.ceil(textWidth)
}

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasDimensions: {
        width: 0,
        height: 0,
        wrh: 1,
      },

      startX: 0,
      startY: 0,
      isDrawing: false,
      selectedText: -1,
      selectedImage: -1,
      currentPath: [],
    }

    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.exitMouse = this.exitMouse.bind(this);
  }


  componentDidMount() {

  }

  // When state is being updated
  componentDidUpdate(prevProps) {
    if (this.props.currentImage.url !== prevProps.currentImage.url) {
      this.resizeCanvas(this.props.currentImage.width, this.props.currentImage.height, this.props.currentImage.wrh);
    }

    if (prevProps.downloadImageTrigger !== this.props.downloadImageTrigger) {
      this.downloadImage(this.props.downloadImageState);
    }

    if (prevProps.currentImage.width !== this.props.currentImage.width || prevProps.currentImage.height !== this.props.currentImage.height) {
      this.resizeCanvas(this.props.currentImage.width, this.props.currentImage.height,  this.props.currentImage.wrh);
    }

    this.drawImages();
    this.drawPaths();
    this.drawText();

  }

  /**
   * 
   * @param {*} newWidth 
   * @param {*} newHeight 
   * @param {*} wrh
   * Resizes Canvas and Redraws everything
   *  
   */
  resizeCanvas(newWidth, newHeight, wrh) {
    console.log(newHeight, newWidth)
    this.setState({
      canvasDimensions: {
        width: newWidth,
        height: newHeight,
        wrh: wrh,
      }
    }, () => {
      this.drawBackground();
      this.drawImages();
      this.drawPaths();
      this.drawText();
    })
  }


  /**
   * (Re-)draws Textboxes
   */
  drawText() {
    var canvas = document.getElementById('canvas-text');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    var context = canvas.getContext('2d');
    this.addTextBoxes(this.props.inputBoxes, context);
  }

  drawPaths() {
    var canvas = document.getElementById('canvas-draw');
    var context = canvas.getContext('2d');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    // or whatever
    if (this.props.drawPaths !== undefined) {
      for (var i = 0; i < this.props.drawPaths.length; i++) {
        for (var j = 0; j < this.props.drawPaths[i].length - 1; j++) {
          this.drawPath(this.props.drawPaths[i][j].x, this.props.drawPaths[i][j].y, this.props.drawPaths[i][j + 1].x, this.props.drawPaths[i][j + 1].y, this.props.drawPaths[i][j].color, this.props.drawPaths[i][j].radius, context)
        }
      }
    }
  }


  /**
   * 
   * @param {*} currX 
   * @param {*} currY 
   * @param {*} tarX 
   * @param {*} tarY 
   * @param {*} color 
   * @param {*} radius 
   * @param {*} context 
   * Draws Path
   *  
   */
  drawPath(currX, currY, tarX, tarY, color, radius, context) {
    context.beginPath()
    context.strokeStyle = color;
    context.lineWidth = radius;
    context.lineJoin = "round";
    context.moveTo(currX, currY);
    context.lineTo(tarX, tarY);
    context.closePath();
    context.stroke();
  }



  /**
   * Draws Canvas Background
   */
  drawBackground() {
    var canvas = document.getElementById('canvas-background');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    var context = canvas.getContext('2d');
    this.drawImage(this.props.currentImage.image, 0, 0, canvas.width, canvas.height, context)
  }


  /** 
   * Draws Images
  */
  drawImages() {
    var canvas = document.getElementById('canvas-images');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < this.props.additionalImages.length; i++) {
      this.drawImage(this.props.additionalImages[i].image, this.props.additionalImages[i].posX, this.props.additionalImages[i].posY, this.props.additionalImages[i].width, this.props.additionalImages[i].height, context);
    }
  }

  /**
  * 
  * @param {*} image Image Object 
  * @param {*} posX Position X of Image
  * @param {*} posY Position Y of Image
  * @param {*} width Width of Image
  * @param {*} height Height of Image
  * @param {*} context The Context which the image is drawn to
  * Loads and adds Images to the passed context
  * 
  */
  drawImage(img, posX, posY, width, height, context) {
    context.drawImage(img, posX, posY, width, height);
  }


  /**
   * 
   * @param {*} textBoxes Array where text objects are stored
   * @param {*} context The context which the text will be drawn to
   * Adds Text to the passed context
   *  
   */
  addTextBoxes(textBoxes, context) {
    for (var i = 0; i < textBoxes.length; i++) {
      var text = textBoxes[i];
      context.font = text.fontSize + 'px ' + text.fontFamily;
      context.strokeStyle = text.outlineColor;
      context.lineWidth = text.outlineWidth;
      context.strokeText(text.text, parseInt(text.textPosX), parseInt(text.textPosY));
      context.fillStyle = text.fontColor;
      context.fillText(text.text, parseInt(text.textPosX), parseInt(text.textPosY));
    }
  }

  /**
   * 
   * @param {*} text 
   * @param {*} x 
   * @param {*} y 
   * Test if x,y is inside the bounding box of text
   * 
   */
  textSelected(text, x, y) {
    return (x >= parseInt(text.textPosX) && x <= (parseInt(text.textPosX) + getTextWidth(text.text, text.fontSize, text.fontFamily)) && y >= (parseInt(text.textPosY) - text.fontSize) && y <= parseInt(text.textPosY));
  }

  imageSelected(image, x, y) {

    console.log(x + '>' + image.posX + '-' + (parseInt(image.posX) + image.width) + ' y: ' + y + '>' + (parseInt(image.posY) + image.height) + '-' + image.posY)
    return (x >= parseInt(image.posX) && x <= (parseInt(image.posX) + image.width) && y <= (parseInt(image.posY) + image.height) && y >= parseInt(image.posY));
  }

  /**
   * 
   * @param {*} event
   * Handles Mouse Down Events
   * Iterates through all input boxes and checks whether the mouse position matches the position of the text.
   * Sets the selected text accordingly
   *  
   */
  handleMouseDown(event) {
    event.preventDefault();
    if (this.props.isDrawMode) {
      var canvas = document.getElementById('canvas-draw');
      var rect = canvas.getBoundingClientRect();
      this.setState({
        isDrawing: true,
      })
    } else {
      console.log("Mouse Down")
      var canvas = document.getElementById('canvas-text');
      var rect = canvas.getBoundingClientRect();
      this.setState({
        startX: parseInt(event.clientX - rect.left),
        startY: parseInt(event.clientY - rect.top),
      }, () => {
        // Put your mousedown stuff here
        console.log("Mouse Curser Start Position: " + this.state.startX + ':' + this.state.startY)
        for (var i = 0; i < this.props.inputBoxes.length; i++) {
          if (this.textSelected(this.props.inputBoxes[i], this.state.startX, this.state.startY, i)) {
            this.setState({
              selectedText: i,
            })
          }
        }
        for (var i = 0; i < this.props.additionalImages.length; i++) {
          if (this.imageSelected(this.props.additionalImages[i], this.state.startX, this.state.startY, i)) {
            this.setState({
              selectedImage: i,
            })
          }
        }
      })
    }
  }

  /**
   * 
   * @param {*} event 
   * Handles Mouse Up Events
   * 
   */
  handleMouseUp(event) {
    event.preventDefault();
    this.exitMouse();
  }


  /**
   * 
   * @param {*} event 
   * Handles Mouse Out Events
   * 
   */
  handleMouseOut(event) {
    event.preventDefault();
    this.exitMouse();
  }

  exitMouse() {
    this.props.addPath(this.state.currentPath);
    this.setState({
      selectedText: -1,
      selectedImage: -1,
      isDrawing: false,
      currentPath: [],
    })
  }


  /**
   * 
   * @param {*} event 
   * Handles Mouse Move Events
   * Checks whether a text has been selected
   * Calculates the new position of the selected text on curser movemeent
   * 
   * 
   */
  handleMouseMove(event) {

    // Handle Drawing
    if (this.state.isDrawing) {
      var canvas = document.getElementById('canvas-draw');
      var context = canvas.getContext('2d');
      var rect = canvas.getBoundingClientRect();
      // Mouse Positions
      var mouseX = parseInt(event.clientX - rect.left);
      var mouseY = parseInt(event.clientY - rect.top);
      var fillColor = this.props.drawColor;
      var brushRadius = this.props.drawBrushSize;
      if(this.state.currentPath.length>0)
      this.drawPath(this.state.currentPath[this.state.currentPath.length-1].x, this.state.currentPath[this.state.currentPath.length-1].y, mouseX, mouseY, fillColor, brushRadius, context)
      this.state.currentPath.push({
        x: mouseX,
        y: mouseY,
        color: fillColor,
        radius: brushRadius,
      });
      
    }
    // Handle Text Dragging
    if (this.state.selectedText > -1) {
      event.preventDefault();
      var canvas = document.getElementById('canvas-text');
      var pos = this.calculatePos(event, canvas);

      var text = this.props.inputBoxes[this.state.selectedText];
      text.textPosX = parseInt(text.textPosX) + pos.dx;
      text.textPosY = parseInt(text.textPosY) + pos.dy;
      this.props.handleInputBoxesChange(this.state.selectedText, 'textPosX', text.textPosX)
      this.props.handleInputBoxesChange(this.state.selectedText, 'textPosY', text.textPosY)
      this.drawText();
    }

    // Handle Image Dragging
    if (this.state.selectedImage > -1) {
      event.preventDefault();
      var canvas = document.getElementById('canvas-images');
      var pos = this.calculatePos(event, canvas);

      var image = this.props.additionalImages[this.state.selectedImage];
      image.posX = parseInt(image.posX) + pos.dx;
      image.posY = parseInt(image.posY) + pos.dy;
      this.props.handleImageChange({ id: this.state.selectedImage, posX: image.posX, posY: image.posY })
    }
  }

  /**
   * 
   * @param {*} event 
   * @param {*} canvas 
   * Calculates the change of position of the mouse
   * 
   */
  calculatePos(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    // Mouse Positions
    var mouseX = parseInt(event.clientX - rect.left);
    var mouseY = parseInt(event.clientY - rect.top);

    var dx = mouseX - this.state.startX;
    var dy = mouseY - this.state.startY;

    this.setState({
      startX: mouseX,
      startY: mouseY,
    })
    return ({ dx: dx, dy: dy })
  }

  /**
   *  Merges the different canvas and then downloads Meme as png
   */
  downloadImage = () => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    const context = canvas.getContext("2d");

    const canvasBackground = document.getElementById("canvas-background");
    const canvasImages = document.getElementById("canvas-images");
    const canvasDraw = document.getElementById("canvas-draw");
    const canvasText = document.getElementById("canvas-text");
    context.drawImage(canvasBackground, 0, 0);
    context.drawImage(canvasImages, 0, 0);
    context.drawImage(canvasDraw, 0, 0);
    context.drawImage(canvasText, 0, 0);
    const canvasdata = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
    const a = document.createElement("a");
    a.download = this.props.currentImage.name + '.png';

    a.href = canvasdata;
    document.body.appendChild(a);
    a.click();
  }

  render() {

    return (
      <div>
        <div id="canvas-container">
          <canvas id="canvas-background"></canvas>
          <canvas id="canvas-images" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp}> </canvas>
          <canvas id="canvas-draw" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp}> </canvas>
          <canvas id="canvas-text" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp}> </canvas>
        </div>
      </div>
    )
  }
}




export default CanvasComponent;
