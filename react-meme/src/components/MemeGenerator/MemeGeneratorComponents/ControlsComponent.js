import GetImagesComponents from './GetImagesComponent';
const React = require('react');
require('./ControlsComponent.css');

class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      imageMemeArray: null,
      index: 0,
    };

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.createUI = this.createUI.bind(this);
    this.generateMemeButton = this.generateMemeButton.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
  }

  // Initialize
  componentDidMount() {
  }


  componentDidUpdate(prevProps, prevState) {
  }

  // Get Meme Array from Child
  setImagesArray = (memeArray) => {
    this.setState({
      imageMemeArray: memeArray,
      index: 0,
    }, () =>  this.resetMemeState())

  }


  // Set Current Meme State with index
  setCurrentMemeState(index) {
    if (this.state.imageMemeArray !== undefined && this.state.imageMemeArray !== null) {
      console.log(this.state.imageMemeArray)
      this.props.setCurrentMeme(this.state.imageMemeArray[index])
      this.props.setInputBoxes(this.state.imageMemeArray[index].inputBoxes);
      this.setState({
        index: index,
      })
    }

  }

  //reset
  resetMemeState(){
    this.setCurrentMemeState(0);
  }


  //Set new index with step
  setNewIndexWithStep(step) {
    var newIndex = (this.state.index + step + (this.state.imageMemeArray.length)) % (this.state.imageMemeArray.length);
    this.setCurrentMemeState(newIndex);
  }

  // Previous Button
  prevButton() {
    this.setNewIndexWithStep(-1)
  }

  // Next Button
  nextButton() {
    this.setNewIndexWithStep(1)
  }


  // Search Function
  searchImage() {
    for (var i = 0; i < this.imageMemeArray.length; i++) {
      if (this.imageMemeArray[i].name.toLowerCase().includes(document.getElementById('search-text-box').value.toLowerCase())) {
        console.log("found " + i)
        this.setCurrentMemeState(i)
      }
    }
  }

  // Handle Events when Text or Color Inputs changed and store it in the inputBoxesStates
  handleChange(i, event) {
    console.log(this.state.imageMemeArray[this.state.index].inputBoxes[0])
    console.log("id: " + this.state.imageMemeArray[this.state.index].inputBoxes[0] + "///" + event.target.name + " XX " + event.target.value)
    console.log(this.state.imageMemeArray[this.state.index])
    this.state.imageMemeArray[this.state.index].inputBoxes.map(
      obj => (obj.textID === i ? Object.assign(obj, { [event.target.name]: event.target.value }) : obj)
    )



    this.props.setInputBoxes(this.state.imageMemeArray[this.state.index].inputBoxes);
    //console.log(this.state.inputBoxes)

  }


  // Add Input Boxes (Text & Color) depending on the meme boxcount
  createUI() {
    if (this.state.imageMemeArray !== null) {
      return this.state.imageMemeArray[this.state.index].inputBoxes.map((el, i) =>
        <div key={i}>
          <input type="text" placeholder="Text" name="text" className="input-box" onChange={this.handleChange.bind(this, i)} />
          <input type="text" placeholder="50" name="fontSize" className="number-input-box" min="1" max="100" maxLength="2" onChange={this.handleChange.bind(this, i)} />
          <select name="fontFamily" className="input-box" onChange={this.handleChange.bind(this, i)}>
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

  //Generate Meme Button
  generateMemeButton() {
    this.props.generateMeme();
  }

  // Render
  render() {
    return (
      <div id="control-view">
        <div className="inner-grid" id="left-container">
          <h1 id="header-text"> Meme Generator </h1>
          <div id="select-img-buttons">
            <GetImagesComponents setImagesArray={this.setImagesArray} URL={this.props.URL} />
          </div>
          <input type="text" id="search-text-box" class="input-box" />
          <button id="search-button" class="button" onClick={this.searchImage}> Search </button>
          <button onClick={this.prevButton} id="prev-button" className="button" > Back </button>
          <button onClick={this.nextButton} id="next-button" className="button" > Next </button>
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