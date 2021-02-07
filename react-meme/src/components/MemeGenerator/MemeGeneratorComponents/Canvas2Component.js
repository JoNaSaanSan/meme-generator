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
function getTextWidth(inputText, font) {
  // re-use canvas object for better performance
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = font;
  return Math.ceil(context.measureText(inputText).width)
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

class CanvasText {
  /**
   * 
   * @param {number} textID 
   * @param {string} text 
   * @param {number} posX 
   * @param {number} posY 
   * @param {number} height 
   * @param {number} width 
   * @param {string} fontColor 
   * @param {string} fontFamily 
   * @param {number} fontSize 
   */
  constructor(textID, text, posX, posY, width, height, fontColor, fontFamily, fontSize) {
    this.textID = textID;
    this.text = text;
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
  }
}

var offsetX, offsetY;

class Canvas2Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      canvasStack: {
        canvasMainImage: '',
        canvasOtherImages: [],
        canvasDrawPath: [],
        canvasText: [],
      },

      canvasDimensions: {
        width: 0,
        height: 0,
        wrh: 1,
      },

      startX: 0,
      startY: 0,
      selectedText: -1,
    }

    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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

      console.log(newHeight)

      this.setState({
        canvasDimensions: {
          width: newWidth,
          height: newHeight,
          wrh: wrh,
        },
        canvasStack: {
          ...this.state.canvasStack,
          canvasMainImage: new CanvasImage(0, this.props.currentImage.url, 0, 0, newWidth, newHeight)
        }
      }, () => {
        this.drawBackground()
        this.drawText()
      })
      console.log(this.state.canvasStack.canvasText)
    }

    if (prevProps.downloadImageTrigger !== this.props.downloadImageTrigger) {
      this.convertSvgToImage(this.props.downloadImageState);
    }

    if (this.props.inputBoxesUpdated !== prevProps.inputBoxesUpdated) {
      this.props.inputBoxes.map((el, i) => {
        if (this.state.canvasStack.canvasText !== undefined) {
          var font = this.props.inputBoxes[i].fontSize + ' ' + this.props.inputBoxes[i].fontFamily
          this.state.canvasStack.canvasText[i] = new CanvasText(this.props.inputBoxes[i].textID, this.props.inputBoxes[i].text, this.props.inputBoxes[i].textPosX,
            this.props.inputBoxes[i].textPosY, getTextWidth(this.props.inputBoxes[i].text, font), this.props.inputBoxes[i].fontSize, 
            this.props.inputBoxes[i].fontColor, this.props.inputBoxes[i].fontFamily, this.props.inputBoxes[i].fontSize);
        }
      })
      console.log(this.state.canvasStack.canvasText)
    }
    //  console.log(this.state.canvasStack.canvasText)
    this.drawText();
    console.log("change in inputboxes")
  }


  drawBackground() {
    var canvas = document.getElementById('canvas-background');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    var context = canvas.getContext('2d');
    this.addImage(this.state.canvasStack.canvasMainImage, context);
  }

  // Handle Draw
  drawText() {
    console.log("Draw")
    var canvas = document.getElementById('canvas-text');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;

    let rect = canvas.getBoundingClientRect();


    // Calculate new position of text

    offsetX = rect.left;
    offsetY = rect.top;
    console.log(offsetX + "::" + offsetY)

    var context = canvas.getContext('2d');
    console.log(this.props.inputBoxes)
    this.addTextBoxes(this.props.inputBoxes, context);
  }

  // Loads Image
  addImage(image, context) {
    var img = new Image();
    img.onload = function () {
      context.drawImage(img, image.posX, image.posY, image.width, image.height);

    };
    img.src = image.url;
  }

  addTextBoxes(textBoxes, context) {
    for (var i = 0; i < textBoxes.length; i++) {
      var text = textBoxes[i];
      context.font = text.fontSize + 'px ' + text.fontFamily;
      context.strokeStyle = 'black';
      context.lineWidth = 3;
      context.strokeText(text.text, text.textPosX, text.textPosY);
      context.fillStyle = text.fontColor;
      context.fillText(text.text, text.textPosX, text.textPosY);
    }
  }

  // test if x,y is inside the bounding box of texts[textIndex]
  textSelected(text, x, y) {
    console.log(text.posX, text.posX + text.width, text.posY - text.height, text.posY)
    return (x >= text.posX && x <= text.posX + text.width && y >= text.posY - text.height && y <= text.posY);
  }

  // handle mousedown events
  // iterate through texts[] and see if the user
  // mousedown'ed on one of them
  // If yes, set the selectedText to the index of that text

  handleMouseDown(e) {
    e.preventDefault();
    console.log("Mouse Down")
    this.setState({
      startX: parseInt(e.clientX - offsetX),
      startY: parseInt(e.clientY - offsetY),
    }, () => {
      // Put your mousedown stuff here
      console.log(this.state.startX + ':' + this.state.startY)
      for (var i = 0; i < this.state.canvasStack.canvasText.length; i++) {
        if (this.textSelected(this.state.canvasStack.canvasText[i], this.state.startX, this.state.startY, i)) {
          console.log(i)
          this.setState({
            selectedText: i,
          })
        }
      }
    })


  }

  // done dragging
  handleMouseUp(e) {
    e.preventDefault();
    this.setState({
      selectedText: -1,
    })
  }

  // also done dragging
  handleMouseOut(e) {
    e.preventDefault();
    this.setState({
      selectedText: -1,
    })
  }

  // handle mousemove events
  // calc how far the mouse has been dragged since
  // the last mousemove event and move the selected text
  // by that distance
  handleMouseMove(e) {
    if (this.state.selectedText < 0) {
      return;
    }
    e.preventDefault();
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var dx = mouseX - this.state.startX;
    var dy = mouseY - this.state.startY;

    this.setState({
      startX: mouseX,
      startY: mouseY,
    })


    var text = this.state.canvasStack.canvasText[this.state.selectedText];
    text.posX += dx;
    text.posY += dy;
    this.drawText();
  }

  render() {

    return (
      <div>
        <div id="canvas-container">
          <canvas id="canvas-background"></canvas>
          <canvas id="canvas-images"> </canvas>
          <canvas id="canvas-draw"> </canvas>
          <canvas id="canvas-text" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp}> </canvas>
        </div>

      </div>
    )
  }
}




export default Canvas2Component;
