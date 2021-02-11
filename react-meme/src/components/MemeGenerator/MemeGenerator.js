import ControlsComponent from './MemeGeneratorComponents/ControlsComponent';
import ImageComponent from './MemeGeneratorComponents/ImageComponent';
import PreviewComponent from './MemeGeneratorComponents/PreviewComponent';
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
    }

    this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addTextBoxes = this.addTextBoxes.bind(this);
    this.addAdditionalImages = this.addAdditionalImages.bind(this);
    this.addPath = this.addPath.bind(this);
    this.undoDrawing = this.undoDrawing.bind(this);
    this.clearDrawing = this.clearDrawing.bind(this);
    this.clearImages = this.clearImages.bind(this);
  }


  // Initialize
  componentDidMount() {

  }

  /**
   * 
   * @param {Meme} currentMemeFromChild 
   * Sets current Meme
   */
  setCurrentMeme = (currentMemeFromChild) => {
    this.setState({
      currentMeme: currentMemeFromChild,
      inputBoxes: currentMemeFromChild.inputBoxes,
    }, () => this.assignNewText2Textboxes(this.state.tmpInputTextBoxesArray))
  }

  /**
 * 
 * @param {array} textBoxesArray 
 * This function assigns input textboxes with values from an array which consists of input text box objects that were stored previously
 *  
 */
  assignNewText2Textboxes(textBoxesArray) {
    this.state.inputBoxes.map(
      obj => {
        if (obj.text === '' && textBoxesArray[obj.textID] !== undefined) {
          (Object.assign(obj, textBoxesArray[obj.textID]))
        }
      }
    )
    this.setState({
      ...this.state.inputBoxes,
    })
  }


  addPath(path) {
    if (path.length > 0) {
      this.state.drawPaths.push(path);
    }
    this.setState({
      ...this.state.drawPaths
    })
  }

  undoDrawing() {
    this.state.drawPaths.pop();
    this.setState({
      ...this.state.drawPaths
    })
  }

  clearDrawing() {
    this.setState({
      drawPaths: [],
    })
  }


  addAdditionalImages(image) {
    this.state.additionalImages.push(image);
    console.log(image)
    this.setState({
      ...this.state.additionalImages
    })
  }


  imageAdded(image){
    this.loadImage(image.url).then(result => {
      this.state.currentImages.push(result);
      this.setState({
        ...this.state.currentImages,
      })
    })
  }


  clearImages() {
    this.setState({
      additionalImages: [],
    })
  }
  

  handleImageChange(image){
    console.log(image)
    Object.assign(this.state.additionalImages[image.id], image)
    this.setState({
      ...this.state.additionalImages
    })
  }


  /**
  * 
  * @param {number} i The index number of the text box
  * @param {string} eventName The event name which is triggering this function
  * @param {string} eventValue The event value that comes with the event name
  * This function handles events whenever text, color or other settings of the text boxes are changed. 
  * The changed input boxes of the meme are updated and the current input box state is saved in an array in order to 
  * keep the data for future memes that the user might switch to
  * 
  */
  handleInputBoxesChange(i, eventName, eventValue) {
    this.state.inputBoxes[i] = Object.assign(this.state.inputBoxes[i], { [eventName]: eventValue })
    if (this.state.tmpInputTextBoxesArray[i] !== undefined) {
      Object.assign(this.state.tmpInputTextBoxesArray[i], { [eventName]: eventValue })
    } else {
      this.state.tmpInputTextBoxesArray[i] = { [eventName]: eventValue }
    }
    console.log(this.state.tmpInputTextBoxesArray[i])
    this.setState({
      ...this.state.inputBoxes,
      inputBoxesUpdated: !this.state.inputBoxesUpdated,
    })
  }

  /**
   * Adds a new Text Box
   */
  addTextBoxes() {
    this.state.inputBoxes.push(
      new TextBoxes(
        this.state.inputBoxes.length,
        initializeText.text,
        initializeText.textPosX,
        this.state.inputBoxes.length * initializeText.textPosY + 50,
        initializeText.fontColor,
        initializeText.fontFamily,
        initializeText.fontSize,
        initializeText.outlineWidth,
        initializeText.outlineColor)
    );
    this.setState({
      ...this.state.inputBoxes,
    })
  }

  render() {
    // Redux: Update Signed in State
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

    return (
      <div class="generator-view">
        <div class="outer-container">
          <ControlsComponent
            URL={this.state.URL}
            setInputBoxes={this.setInputBoxes}
            handleInputBoxesChange={this.handleInputBoxesChange}
            currentInputBoxes={this.state.inputBoxes}
            generateMeme={this.generateMeme}
            setCurrentMeme={this.setCurrentMeme}
            addTextBoxes={this.addTextBoxes} />
          <ImageComponent generateMeme={this.generateMeme}
            currentMeme={this.state.currentMeme}
            inputBoxes={this.state.inputBoxes}
            inputBoxesUpdated={this.state.inputBoxesUpdated}
            additionalImages={this.state.additionalImages}
            addAdditionalImages={this.addAdditionalImages}
            handleImageChange={this.handleImageChange}
            clearImages={this.clearImages}
            drawPaths={this.state.drawPaths}
            addPath={this.addPath}
            handleInputBoxesChange={this.handleInputBoxesChange}
            clearDrawing={this.clearDrawing}
            undoDrawing={this.undoDrawing}
          />
          <img src={this.state.generatedMeme.url} />
        </div>
      </div>
    )
  }
}

export default MemeGenerator;