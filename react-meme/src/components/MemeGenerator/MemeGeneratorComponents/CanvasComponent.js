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

class Points {
  constructor(pID, posX, posY, radius, color) {
    this.pID = pID;
    this.posX = posX;
    this.posY = posY;
    this.radius = radius;
    this.color = color;
  }
}

class CanvasImage {
  /**
   * 
   * @param {number} imgID Image ID
   * @param {string} url URL of Image
   * @param {number} posX Position X on Canvas
   * @param {number} posY Position Y on Canvas
   * @param {number} height Height of Image
   * @param {number} width Width of Image
   */
  constructor(imgID, url, posX, posY, width, height) {
    this.imgID = imgID;
    this.url = url;
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
  }
}

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      canvasStack: {
        canvasMainImage: '',
        canvasOtherImages: [],
        canvasText: [],
      },

      canvasDimensions: {
        width: 0,
        height: 0,
        wrh: 1,
      },

      startX: 0,
      startY: 0,
      isDrawing: false,
      selectedText: -1,
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

      var wrh = this.props.currentImage.width / this.props.currentImage.height;
      var newWidth = this.props.currentImage.width;
      var newHeight = this.props.currentImage.height;
      var maxWidth = 400;
      var maxHeight = 400;
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / wrh;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * wrh;
      }

      this.setState({
        canvasStack: {
          canvasMainImage: new CanvasImage(0, this.props.currentImage.url, 0, 0, newWidth, newHeight)
        }
      }, () => this.resizeCanvas(newWidth, newHeight, wrh))
    }

    if (prevProps.downloadImageTrigger !== this.props.downloadImageTrigger) {
      this.downloadImage(this.props.downloadImageState);
    }
    this.drawText();
    this.drawPaths();
  }

  resizeCanvas(newWidth, newHeight, wrh) {
    this.setState({
      canvasDimensions: {
        width: newWidth,
        height: newHeight,
        wrh: wrh,
      }
    }, () => {
      this.drawBackground();
      this.drawText();
      this.drawPaths();
    })
  }

  /**
   * Draws Canvas Background
   */
  drawBackground() {
    var canvas = document.getElementById('canvas-background');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    var context = canvas.getContext('2d');
    this.addImage(this.state.canvasStack.canvasMainImage, 0, 0, canvas.width, canvas.height, context);
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
    console.log(this.props.drawPaths)
    if (this.props.drawPaths !== undefined) {
      for (var i = 0; i < this.props.drawPaths.length; i++) {
        for (var j = 0; j < this.props.drawPaths[i].length-1; j++) {
          this.drawPath(this.props.drawPaths[i][j].x, this.props.drawPaths[i][j].y, this.props.drawPaths[i][j+1].x, this.props.drawPaths[i][j+1].y,this.props.drawPaths[i][j].color, this.props.drawPaths[i][j].radius, context)
        }
      }
    }
  }


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

  drawTmpPath(currX, currY, color, radius, context) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(currX, currY);
    context.arc(currX, currY, radius, 0, Math.PI * 2, false);
    context.fill();
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
  addImage(image, posX, posY, width, height, context) {
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function () {
      context.drawImage(img, posX, posY, width, height);

    };
    img.src = image.url;
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
    if (this.state.isDrawing) {
      var canvas = document.getElementById('canvas-draw');
      var context = canvas.getContext('2d');
      var rect = canvas.getBoundingClientRect();
      // Mouse Positions
      var mouseX = parseInt(event.clientX - rect.left);
      var mouseY = parseInt(event.clientY - rect.top);
      var fillColor = this.props.drawColor;
      var brushRadius;

      if (this.props.drawBrushSize === '') {
        brushRadius = '2'
      } else {
        brushRadius = this.props.drawBrushSize;
      };

      this.state.currentPath.push({
        x: mouseX,
        y: mouseY,
        color: fillColor,
        radius: brushRadius,
      });
      this.drawTmpPath(mouseX, mouseY, fillColor, brushRadius, context)
    }
    if (this.state.selectedText > -1) {
      event.preventDefault();
      var canvas = document.getElementById('canvas-text');
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

      var text = this.props.inputBoxes[this.state.selectedText];
      text.textPosX = parseInt(text.textPosX) + dx;
      text.textPosY = parseInt(text.textPosY) + dy;
      this.props.handleInputBoxesChange(this.state.selectedText, 'textPosX', text.textPosX)
      this.props.handleInputBoxesChange(this.state.selectedText, 'textPosY', text.textPosY)
      this.drawText();
    }
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
    const canvasDraw = document.getElementById("canvas-draw");
    const canvasText = document.getElementById("canvas-text");
    context.drawImage(canvasBackground, 0, 0);
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
          <canvas id="canvas-images"> </canvas>
          <canvas id="canvas-draw" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp}> </canvas>
          <canvas id="canvas-text" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp}> </canvas>
        </div>
      </div>
    )
  }
}




export default CanvasComponent;
