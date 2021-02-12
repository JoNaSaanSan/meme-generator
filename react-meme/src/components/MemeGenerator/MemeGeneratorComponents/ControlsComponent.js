import GetImagesComponents from './GetImagesComponent';
import Store from '../../../redux/store';
const React = require('react');
require('./ControlsComponent.css');

class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: Store.getState().user.isSignedIn,
      imageMemeArray: null,
      index: 0,
      searchText: '',
      titleText: '',
    };

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.searchTemplate = this.searchTemplate.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.updateText = this.updateText.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
  }

  /**
   * 
   * @param {Array of Meme Objects} memeArray 
   * Called whenever a new source of images are loaded. 
   * Initializes the new array of meme objects and stores them in a state
   * 
   */
  setImagesArray = (memeArray) => {
    this.setState({
      imageMemeArray: memeArray,
      index: 0,
      width: 400,
      height: 400,
    }, () => this.resetMemeState())

  }


  /**
   * 
   * @param {number} index The index of the target meme
   * Creates a new Meme state: Called whenever the user changes the meme template
   * 
   */
  setCurrentMemeState(index) {
    if (this.state.imageMemeArray !== undefined && this.state.imageMemeArray !== null) {
      this.setState({
        index: index,
        width: this.state.imageMemeArray[index].width,
        height: this.state.imageMemeArray[index].height,
      }, () => {
        try {
          this.props.setCurrentMeme(this.state.imageMemeArray[this.state.index]);
        } catch (e) {
          console.log(e);
        }
        //this.props.setInputBoxes(this.state.imageMemeArray[this.state.index].inputBoxes);
      })
    }
  }

  /**
   * resets meme index to 0
   */
  resetMemeState() {
    this.setCurrentMemeState(0);
  }


  /**
   * 
   * @param {number} step How large a step is 
   * If the user wants an adjacent template, the step would be 1
   * 
   */
  setNewIndexWithStep(step) {
    try {
      var newIndex = (this.state.index + step + (this.state.imageMemeArray.length)) % (this.state.imageMemeArray.length);
      this.setCurrentMemeState(newIndex);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Previous and next buttons
   */
  prevButton() {
    this.setNewIndexWithStep(-1)
  }
  nextButton() {
    this.setNewIndexWithStep(1)
  }


  /**
   * This function is called whenever the user wants to search for a template
   */
  searchTemplate() {
    if (this.state.imageMemeArray !== null) {
      for (var i = 0; i < this.state.imageMemeArray.length; i++) {
        if (this.state.imageMemeArray[i].name.toLowerCase().includes(this.state.searchText.toLowerCase())) {
          console.log("found " + i)
          this.setCurrentMemeState(i)
        }
      }
    }
  }

  /**
   * This function is called whenever the user wants to change the title
   */
  changeTitle() {
    if (this.state.titleText !== '' && this.state.imageMemeArray !== null) {
      this.state.imageMemeArray[this.state.index].name = this.state.titleText;
      this.props.setCurrentMeme(this.state.imageMemeArray[this.state.index])
    }
  }

  /**
  *  Handles text inputs from search & title change
  */
  updateText(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleCanvasChange(event) {
    this.props.handleCanvasChange(event)
  }


  render() {
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))
    return (
      <div className="control-view">
        <div>
          <GetImagesComponents setImagesArray={this.setImagesArray} URL={this.props.URL} />
        </div>
        <div className="search-buttons-container">
          <input type="text" name="searchText" id="search-text-box" className="input-box" onChange={this.updateText} />
          <button id="search-button" className="button" onClick={this.searchTemplate}> Search </button>
        </div>

        <div className="image-selection-buttons-container">
          <button onClick={this.prevButton} id="prev-button" className="button" > Back </button>
          <button onClick={this.nextButton} id="next-button" className="button" > Next </button>
        </div>

        <div className="image-title-input-container">
          <input type="text" name="titleText" className="input-box" onChange={this.updateText} />
          <button id="change-title-button" className="button" onClick={this.changeTitle}> Change Meme Title </button>
        </div>
        <div>
          <input type="text" placeholder="400" name="canvasWidth" className="dimension-input-box" maxLength="3" value={this.props.canvasWidth} onChange={this.handleCanvasChange.bind(this)} />
          <input type="text" placeholder="400" name="canvasHeight" className="dimension-input-box" maxLength="3" value={this.props.canvasHeight} onChange={this.handleCanvasChange.bind(this)} />
        </div>


        <button onClick={() => this.props.generateMemeImageFlip()} id="generate-button" className="button" > Generate Meme with Imgflip </button>
        {this.state.isSignedIn ?
          <div> <button onClick={this.props.publishMeme()} id="publish-button" className="button" > Publish Meme </button>
            <button onClick={this.props.saveDraft()} id="save-button" className="button" > Save as Draft </button> </div> : <button className="button"> Sign in to publish or save! </button>}
        <button onClick={this.props.shareMeme()} id="share-button" className="button" > Share Meme</button>
        <button onClick={() => this.props.downloadImage()} id="download-button" className="button">Download Meme!</button>

      </div>
    )
  }
}

export default ControlsComponent;