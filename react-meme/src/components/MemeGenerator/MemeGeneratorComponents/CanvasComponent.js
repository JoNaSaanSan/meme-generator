const React = require('react');
require('./CanvasComponent.css');

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(inputText, isBold, isItalic, fontSize, fontFamily) {
  // re-use canvas object for better performance
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var style = '';
  if(isBold){
    style += 'bold '
  }
  if(isItalic){
    style += 'italic '
  }
  var font = style + fontSize + "px " + fontFamily;
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
      this.resizeCanvas(this.props.canvasWidth, this.props.canvasHeight, 1);
    }

    if (((prevProps.canvasWidth !== this.props.canvasWidth) && (this.props.canvasWidth > 0)) || ((prevProps.canvasHeight !== this.props.canvasHeight) && (this.props.canvasHeight > 0))) {
      this.resizeCanvas(this.props.canvasWidth, this.props.canvasHeight, 1);
    }

    this.drawImages();
    this.drawPaths();
    this.drawText();


    if (prevProps.retrieveImageTrigger !== this.props.retrieveImageTrigger) {
      this.retrieveImage();
    }
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
    var container = document.getElementById('canvas-container');
    container.style.width = this.state.canvasDimensions.width;
    container.height = this.state.canvasDimensions.height;
    console.log(container)
    var canvas = document.getElementById('canvas-background');
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    var context = canvas.getContext('2d');
    if (this.props.currentImage.image !== undefined)
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
      var style = '';
      if(text.isBold){
        style += 'bold '
      }
      if(text.isItalic){
        style += 'italic '
      }
      context.font = style + text.fontSize + 'px ' + text.fontFamily;
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
    return (x >= parseInt(text.textPosX) && x <= (parseInt(text.textPosX) + getTextWidth(text.text, text.isBold, text.isItalic, text.fontSize, text.fontFamily)) && y >= (parseInt(text.textPosY) - text.fontSize) && y <= parseInt(text.textPosY));
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
    var canvas;
    var rect
    event.preventDefault();
    if (this.props.isDrawMode) {
      canvas = document.getElementById('canvas-draw');
      rect = canvas.getBoundingClientRect();
      this.setState({
        isDrawing: true,
      })
    } else {
      console.log("Mouse Down")
      canvas = document.getElementById('canvas-text');
      rect = canvas.getBoundingClientRect();
      this.setState({
        startX: parseInt(event.clientX - rect.left),
        startY: parseInt(event.clientY - rect.top),
      }, () => {
        // Put your mousedown stuff here
        console.log("Mouse Curser Start Position: " + this.state.startX + ':' + this.state.startY)
        for (var i = 0; i < this.props.inputBoxes.length; i++) {
          if (this.textSelected(this.props.inputBoxes[i], this.state.startX, this.state.startY, i)) {
            this.selectText(i);
            this.setState({
              selectedText: i,
            })
          }
        }
        for (var j = 0; j < this.props.additionalImages.length; j++) {
          if (this.imageSelected(this.props.additionalImages[j], this.state.startX, this.state.startY, j)) {
            this.setState({
              selectedImage: j,
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
    var canvas;
    var context;
    // Handle Drawing
    if (this.state.isDrawing) {
      canvas = document.getElementById('canvas-draw');
      context = canvas.getContext('2d');
      var rect = canvas.getBoundingClientRect();
      // Mouse Positions
      var mouseX = parseInt(event.clientX - rect.left);
      var mouseY = parseInt(event.clientY - rect.top);
      var fillColor = this.props.drawColor;
      var brushRadius = this.props.drawBrushSize;
      if (this.state.currentPath.length > 0)
        this.drawPath(this.state.currentPath[this.state.currentPath.length - 1].x, this.state.currentPath[this.state.currentPath.length - 1].y, mouseX, mouseY, fillColor, brushRadius, context)
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
      canvas = document.getElementById('canvas-text');
      let pos = this.calculatePos(event, canvas);

      var text = this.props.inputBoxes[this.state.selectedText];
      text.textPosX = parseInt(text.textPosX) + pos.dx;
      text.textPosY = parseInt(text.textPosY) + pos.dy;
      var eventX = { target: { name: 'textPosX', value: text.textPosX } }
      var eventY = { target: { name: 'textPosY', value: text.textPosY } }
      this.props.handleInputBoxesChange(this.state.selectedText, eventX)
      this.props.handleInputBoxesChange(this.state.selectedText, eventY)
      this.drawText();
    }

    // Handle Image Dragging
    if (this.state.selectedImage > -1) {
      event.preventDefault();
      canvas = document.getElementById('canvas-images');
      let pos = this.calculatePos(event, canvas);

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
 * 
 * @param {index} i index of text
 * Select text according to the index
 *  
 */
  selectText(i) {
    console.log('text-input_' + i)
    const input = document.getElementById('text-input_' + i);

    input.focus();
    input.select();
  }

  /**
   *  Merges the different canvas and then downloads Meme as png
   */
  retrieveImage = () => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.width = this.state.canvasDimensions.width;
    canvas.height = this.state.canvasDimensions.height;
    const context = canvas.getContext("2d");

    const canvasBackground = document.getElementById("canvas-background");
    const canvasImages = document.getElementById("canvas-images");
    const canvasDraw = document.getElementById("canvas-draw");
    const canvasText = document.getElementById("canvas-text");
    try {
      context.drawImage(canvasBackground, 0, 0);
      context.drawImage(canvasImages, 0, 0);
      context.drawImage(canvasDraw, 0, 0);
      context.drawImage(canvasText, 0, 0);

      const canvasdata = canvas.toDataURL("image/png");
      this.props.imageRetrieved(canvasdata)
    } catch (e) {
      console.log(e)
    }
  }

  render() {

    return (
      <div>
        <div id="canvas-container" >
          <canvas id="canvas-background" />
          <canvas id="canvas-images" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp} />
          <canvas id="canvas-draw" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp} />
          <canvas id="canvas-text" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut} onMouseUp={this.handleMouseUp} />
        </div>
      </div>
    )
  }
}




export default CanvasComponent;
