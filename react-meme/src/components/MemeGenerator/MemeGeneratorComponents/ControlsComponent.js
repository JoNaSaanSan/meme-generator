import GetImagesComponents from './GetImagesComponent';
const React = require('react');
require('./ControlsComponent.css');

class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      imageMemeArray: null,
      prevIndex: 0,
      index: 0,
    };

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.searchTemplate = this.searchTemplate.bind(this);
    this.createUI = this.createUI.bind(this);
    this.lockText = this.lockText.bind(this);
    this.generateMemeButton = this.generateMemeButton.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
  }

  // Initialize
  componentDidMount() {
  }


  componentDidUpdate(prevProps, prevState) {

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
      prevIndex: 0,
      lockText: true,
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
      if (this.state.imageMemeArray[index].inputBoxes.length > 0 && this.state.lockText) {

     
          console.log(this.state.imageMemeArray[index].inputBoxes[0].text)
          this.state.imageMemeArray[index].inputBoxes = this.state.imageMemeArray[this.state.prevIndex].inputBoxes;
        
      }
      this.props.setCurrentMeme(this.state.imageMemeArray[index])
      this.props.setInputBoxes(this.state.imageMemeArray[index].inputBoxes);
      this.setState({
        prevIndex: this.state.index,
        index: index,
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
   * This method is called if the user wants to search for a template
   */
  searchTemplate() {
    for (var i = 0; i < this.state.imageMemeArray.length; i++) {
      if (this.state.imageMemeArray[i].name.toLowerCase().includes(document.getElementById('search-text-box').value.toLowerCase())) {
        console.log("found " + i)
        this.setCurrentMemeState(i)
      }
    }
  }

  /**
   * 
   * @param {number} i The index number of the text box
   * @param {Event} event The event which is triggering this function
   * This function handles events whenever text, color or other settings of the text boxes are changed. 
   * The input boxes of the meme are updated and the current state is saved as a previous index in order to 
   * keep the data for future memes that the user might switch to
   * 
   */
  handleChange(i, event) {
    this.state.imageMemeArray[this.state.index].inputBoxes.map(
      obj => (obj.textID === i ? Object.assign(obj, { [event.target.name]: event.target.value }) : obj)
    )
    this.props.setInputBoxes(this.state.imageMemeArray[this.state.index].inputBoxes);
  }

  /**
   *  This function adds input boxes dynamically.
   *  It adds as many text boxes as defined by the meme object.
   * 
   */
  createUI() {
    if (this.state.imageMemeArray !== null) {
      return this.state.imageMemeArray[this.state.index].inputBoxes.map((el, i) =>
        <div key={i}>
          <input type="text" placeholder="Text" name="text" value={this.state.imageMemeArray[this.state.index].inputBoxes[i].text
          } className="input-box" onChange={this.handleChange.bind(this, i)} />
          <input type="text" placeholder="50" name="fontSize" value={this.state.imageMemeArray[this.state.index].inputBoxes[i].fontSize} className="number-input-box" min="1" max="100" maxLength="2" onChange={this.handleChange.bind(this, i)} />
          <select name="fontFamily" className="input-box" value={this.state.imageMemeArray[this.state.index].inputBoxes[i].fontFamily} onChange={this.handleChange.bind(this, i)}>
            <option value="Impact">Impact</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier">Courier</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input type="color" name="fontColor" className="color-input-box" value={this.state.imageMemeArray[this.state.index].inputBoxes[i].fontColor} onChange={this.handleChange.bind(this, i)} />
        </div>)
    } else {
      return;
    }
  }

  lockText(){
    this.setState({
      lockText: !this.state.lockText,
    })
  }

  //Generate Meme Button
  generateMemeButton() {
    this.props.generateMeme();
  }

  render() {
    return (
      <div id="control-view">
        <div className="inner-grid" id="left-container">
          <h1 id="header-text"> Meme Generator </h1>
          <div id="select-img-buttons">
            <GetImagesComponents setImagesArray={this.setImagesArray} URL={this.props.URL} />
          </div>
          <input type="text" id="search-text-box" class="input-box" />
          <button id="search-button" class="button" onClick={this.searchTemplate}> Search </button>
          <button onClick={this.prevButton} id="prev-button" className="button" > Back </button>
          <button onClick={this.nextButton} id="next-button" className="button" > Next </button>
          <input type="checkbox" id="keepText" name="keepText" onClick={this.lockText} checked={this.state.lockText}/>
          <button onClick={this.generateMemeButton} id="generate-button" className="button" > Generate</button>
        </div>
        <p>Insert text below </p>
        <div id="ui-buttons-description"> <div>Text</div><div>Font Size</div><div>Font Family</div><div>Color</div></div>
        <div id="ui-buttons"> {this.createUI()}</div>
      </div>
    )
  }
}

export default ControlsComponent;