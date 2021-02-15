import GetImagesComponents from './GetImagesComponent';
import Store from '../../../redux/store';
const React = require('react');
require('./ControlsComponent.css');

class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: Store.getState().user.isSignedIn,
      accessToken: Store.getState().user.accessToken, 
      imageMemeArray: null,
      index: 0,
      searchText: '',
      titleText: '',
      memeVisibility: 0,
    };

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.searchTemplate = this.searchTemplate.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.updateText = this.updateText.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.createMeme = this.createMeme.bind(this);
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
      let imageMemeArray = [...this.state.imageMemeArray]
      imageMemeArray[this.state.index].name = this.state.titleText;
      this.setState({
        imageMemeArray,
      })
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

  handleVisibilityChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMeme(event) {
    if (event.target.name === 'publish') {
      this.props.createMeme(event, this.state.memeVisibility);
    } else {
      this.props.createMeme(event, -1);
    }
  }


  render() {
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken  }))
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

        <button name="imgFlipGenerate" onClick={this.createMeme} id="generate-button" className="button" > Generate Meme with Imgflip </button>
        {(this.state.accessToken !== '') ?
          <div>
            <select name="memeVisibility" className="input-box" onChange={this.handleVisibilityChange.bind(this)} value={this.state.memeVisibility}>
              <option value="0">Unlisted</option>
              <option value="1">Private</option>
              <option value="2">Public</option>
            </select>
            <button name="publish" onClick={this.createMeme} id="publish-button" className="button" > Publish Meme </button>
            <button name="save" onClick={this.createMeme} id="save-button" className="button" > Save as Draft </button> </div> : <button className="button"> Sign in to publish or save! </button>}
        <button name="share" onClick={this.createMeme} id="share-button" className="button" > Share Meme</button>
        <button name="download" onClick={this.createMeme} id="download-button" className="button">Download Meme!</button>
      </div>
    )
  }
}

export default ControlsComponent;