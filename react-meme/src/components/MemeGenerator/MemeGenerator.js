import ControlsComponent from './MemeGeneratorComponents/ControlsComponent';
import ImageComponent from './MemeGeneratorComponents/ImageComponent';
import PreviewComponent from './MemeGeneratorComponents/PreviewComponent';
import TextUIComponent from './MemeGeneratorComponents/TextUIComponent';
import Store from '../../redux/store';
import TextBoxes from './TextBoxes';
require('./MemeGenerator.css');
const React = require('react');


const initializeText = {
  textID: 0,
  text: '',
  textPosX: 100,
  textPosY: 100,
  fontColor: '#ffffff',
  fontFamily: 'Impact',
  fontSize: '50',
  outlineWidth: '3',
  outlineColor: '#000000',
}


/**
 * Component which handles and displays the Meme Generator
 */
class MemeGenerator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      URL: 'http://localhost:3000/memes/sampleMemes',
      currentMeme: '',
      generatedMeme: '',
      inputBoxes: [],
      drawPaths: [],
      additionalImages: [],
      isSignedIn: Store.getState().user.isSignedIn,
      inputBoxesUpdated: false,
      tmpInputTextBoxesArray: [],
      canvasWidth: 0,
      canvasHeight: 0,
      retrieveImageTrigger: false,
      imageData: null
    }

    this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this);
    this.handleCanvasChange = this.handleCanvasChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addTextBoxes = this.addTextBoxes.bind(this);
    this.addAdditionalImages = this.addAdditionalImages.bind(this);
    this.addPath = this.addPath.bind(this);
    this.undoDrawing = this.undoDrawing.bind(this);
    this.clearDrawing = this.clearDrawing.bind(this);
    this.clearImages = this.clearImages.bind(this);
    this.shareMeme = this.shareMeme.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
    this.generateMemeImageFlip = this.generateMemeImageFlip.bind(this);
    this.imageRetrieved = this.imageRetrieved.bind(this)
  }


  imageRetrieved(data) {
    this.setState({
      imageData: data
    }, () => {
      let canvasdata = this.state.imageData.replace("image/png", "image/octet-stream");

      const a = document.createElement("a");
      a.download = this.state.currentMeme.name + '.png';

      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    })
  }


  retrieveImage() {
    this.setState(
      prevState => ({
        retrieveImageTrigger: !prevState.retrieveImageTrigger
      }))
  }

  /**
   * Handles download image button presses via a boolean that is passed to the child
   */
  downloadImage() {
    this.retrieveImage();

  }

  publishMeme() {

  }

  saveDraft() {


    // POST request using fetch with error handling
    /*
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.generatedMeme)
    };
    fetch(this.props.URL + '/memes/saveMeme', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(data);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch(error => {
        this.setState({
          errorMessage: error.toString()
        });
        console.error('There was an error!', error);
      });*/

  }

  shareMeme() {
    //this.setState(prevState => ({ downloadImageTrigger: !prevState.downloadImageTrigger }))
  }

  generateMemeImageFlip() {

  }


  /**
   * 
   * @param {Meme} currentMemeFromChild 
   * Sets current Meme
   */
  setCurrentMeme = (currentMemeFromChild) => {

    var wrh = currentMemeFromChild.width / currentMemeFromChild.height;
    var newWidth = currentMemeFromChild.width;
    var newHeight = currentMemeFromChild.height;
    var maxWidth = 700;
    var maxHeight = 700;
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / wrh;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * wrh;
    }
    this.setState({
      currentMeme: currentMemeFromChild,
      inputBoxes: currentMemeFromChild.inputBoxes,
      canvasWidth: newWidth,
      canvasHeight: newHeight,
    }, () => this.assignNewText2Textboxes(this.state.tmpInputTextBoxesArray))

    console.log(this.state.currentMeme)
  }

  /**
  * 
  * @param {array} textBoxesArray 
  * This function assigns input textboxes with values from an array which consists of input text box objects that were stored previously
  *  
  */
  assignNewText2Textboxes(textBoxesArray) {
    let inputBoxes = [...this.state.inputBoxes]
    inputBoxes.map(
      obj => {
        if (obj.text === '' && textBoxesArray[obj.textID] !== undefined) {
          return (Object.assign(obj, textBoxesArray[obj.textID]))
        } else {
          return obj;
        }
      }
    )
    this.setState({ inputBoxes })
  }


  addPath(path) {
    if (path.length > 0) {
      this.setState(prevState => ({
        drawPaths: [...prevState.drawPaths, path]
      }))
    }
  }

  undoDrawing() {
    let drawPaths = [...this.state.drawPaths];
    drawPaths.pop();
    this.setState({ drawPaths });
  }

  clearDrawing() {
    this.setState({
      drawPaths: [],
    })
  }


  addAdditionalImages(image) {
    this.setState(prevState => ({
      additionalImages: [...prevState.additionalImages, image]
    }))
  }


  imageAdded(image) {
    this.loadImage(image.url).then(result => {
      this.setState(prevState => ({
        currentImages: [...prevState.currentImages, result]
      }))
    })
  }


  clearImages() {
    this.setState({
      additionalImages: [],
    })
  }

  handleCanvasChange(event) {
    console.log(parseInt(event.target.value))
    if (event.target.value !== '') {
      this.setState({ [event.target.name]: parseInt(event.target.value) })
    } else {
      this.setState({ [event.target.name]: 0 })
    }
  }
  handleImageChange(image) {
    let additionalImages = [...this.state.additionalImages]
    Object.assign(this.state.additionalImages[image.id], image)
    this.setState({
      additionalImages
    })
  }

  /**
  * 
  * @param {number} i The index number of the text box
  * @param {Event} event The event name which is triggering this function
  * This function handles events whenever text, color or other settings of the text boxes are changed. 
  * The changed input boxes of the meme are updated and the current input box state is saved in an array in order to 
  * keep the data for future memes that the user might switch to
  * 
  */
  handleInputBoxesChange(i, event) {
    let inputBoxes = [...this.state.inputBoxes]
    let tmpInputTextBoxesArray = [...this.state.tmpInputTextBoxesArray]
    Object.assign(inputBoxes[i], { [event.target.name]: event.target.value })
    if (this.state.tmpInputTextBoxesArray[i] !== undefined) {
      Object.assign(tmpInputTextBoxesArray[i], { [event.target.name]: event.target.value })
    } else {
      tmpInputTextBoxesArray[i] = { [event.target.name]: event.target.value }
    }
    this.setState({
      inputBoxes,
      tmpInputTextBoxesArray,
      inputBoxesUpdated: !this.state.inputBoxesUpdated,
    })
  }

  /**
   * Adds a new Text Box
   */
  addTextBoxes() {
    this.setState(prevState => ({
      inputBoxes: [...prevState.inputBoxes, new TextBoxes(
        this.state.inputBoxes.length,
        initializeText.text,
        initializeText.textPosX,
        this.state.inputBoxes.length * initializeText.textPosY + 50,
        initializeText.fontColor,
        initializeText.fontFamily,
        initializeText.fontSize,
        initializeText.outlineWidth,
        initializeText.outlineColor)]
    }))
  }

  render() {
    // Redux: Update Signed in State
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

    return (
      <div className="generator-view">
        <ControlsComponent
          URL={this.state.URL}
          generateMeme={this.generateMeme}
          currentMeme={this.state.currentMeme}
          handleCanvasChange={this.handleCanvasChange}
          setCurrentMeme={this.setCurrentMeme}
          downloadImage={this.downloadImage}
          shareMeme={this.shareMeme}
          saveDraft={this.saveDraft}
          publishMeme={this.publishMeme}
          generateMemeImageFlip={this.generateMemeImageFlip}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight} />
        <ImageComponent
          generateMeme={this.generateMeme}
          currentMeme={this.state.currentMeme}
          inputBoxes={this.state.inputBoxes}
          inputBoxesUpdated={this.state.inputBoxesUpdated}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight}
          additionalImages={this.state.additionalImages}
          addAdditionalImages={this.addAdditionalImages}
          handleImageChange={this.handleImageChange}
          clearImages={this.clearImages}
          drawPaths={this.state.drawPaths}
          addPath={this.addPath}
          handleInputBoxesChange={this.handleInputBoxesChange}
          clearDrawing={this.clearDrawing}
          undoDrawing={this.undoDrawing}
          retrieveImageTrigger={this.state.retrieveImageTrigger}
          imageRetrieved={this.imageRetrieved}
        />
        <TextUIComponent
          handleInputBoxesChange={this.handleInputBoxesChange}
          currentInputBoxes={this.state.inputBoxes}
          setInputBoxes={this.setInputBoxes}
          addTextBoxes={this.addTextBoxes}
        />

      </div>
    )
  }
}

export default MemeGenerator;