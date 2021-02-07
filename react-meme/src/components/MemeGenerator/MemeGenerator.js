import ControlsComponent from './MemeGeneratorComponents/ControlsComponent';
import ImageComponent from './MemeGeneratorComponents/ImageComponent';
import PreviewComponent from './MemeGeneratorComponents/PreviewComponent';
import Store from '../../redux/store';
require('./MemeGenerator.css');
const React = require('react');

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
      isSignedIn: Store.getState().user.isSignedIn,
      inputBoxesUpdated: false,
      tmpInputTextBoxesArray: [],
    }

    this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this);
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
    this.state.tmpInputTextBoxesArray[i] = { [eventName]: eventValue }
    this.setState({
      ...this.state.inputBoxes,
      inputBoxesUpdated: !this.state.inputBoxesUpdated,
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
            generateMeme={() => this.generateMeme()}
            setCurrentMeme={this.setCurrentMeme} />
          <ImageComponent generateMeme={this.generateMeme} currentMeme={this.state.currentMeme} inputBoxes={this.state.inputBoxes} inputBoxesUpdated={this.state.inputBoxesUpdated} />
          <img src={this.state.generatedMeme.url} />
        </div>
      </div>
    )
  }
}

export default MemeGenerator;