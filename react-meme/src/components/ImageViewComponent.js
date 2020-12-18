const React = require('react');
const {
  default: ResultComponent
} = require('./ResultComponent');
require('./ImageViewComponent.css');




class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      currentMeme: '',
      // Index of array
      index: 0,
    }

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.createInputBoxes = this.createInputBoxes.bind(this);
    this.searchImage = this.searchImage.bind(this);

  }

  // Initialize
  componentDidMount() {
    this.setCurrentMemeState(0);
  }

  // Set Current Meme State
  setCurrentMemeState(step) {
    var newIndex = this.state.index + step
    this.setState({
      currentMeme: this.props.samplesMemeArray[newIndex],
      index: (newIndex + (this.props.samplesMemeArray.length)) % (this.props.samplesMemeArray.length),
    })

    this.createInputBoxes(this.props.samplesMemeArray[newIndex].box_count)
  }

  // Previous Button
  prevButton() {
    this.setCurrentMemeState(-1)
  }

  // Next Button
  nextButton() {
    this.setCurrentMemeState(1)
  }

  // Create Input Boxes
  createInputBoxes(boxcount) {
    // Remove all existing boxes
    while (document.getElementById('inputText').firstChild) {
      document.getElementById('inputText').removeChild(document.getElementById('inputText').lastChild);
    }

    while (document.getElementById('inputColor').firstChild) {
      document.getElementById('inputColor').removeChild(document.getElementById('inputColor').lastChild);
    }

    // Add Text Input Boxes
    for (var i = 0; i < boxcount; i++) {
      var input = document.createElement("input");
      input.type = "text";
      input.className = "inputClass"; // set the CSS class
      input.id = "textBox_" + i;
      document.getElementById('inputText').appendChild(input); // put it into the DOM


      // Add Color Input Boxes
      var inputColor = document.createElement("input");
      inputColor.type = "color";
      inputColor.className = "inputColorClass"; // set the CSS class
      inputColor.id = "color_" + i;
      document.getElementById('inputColor').appendChild(inputColor); // put it into the DOM
    }
  }

  // Search Function
  searchImage() {
    for (var i = 0; i < this.props.samplesMemeArray.length; i++) {
      if (this.props.samplesMemeArray[i].name.toLowerCase().includes(document.getElementById('searchText').value.toLowerCase())) {
        console.log("found")
        this.setCurrentMemeState(i);
      }
    }
  }

  // Render
  render() {
    return (<div>
      <div>
        <input type="text" id="searchText" />
        <button id="searchButton" onClick={this.searchImage}> Search </button>
      </div>

      <div className="Create" >
        <div id="slideShowImages" >
          <h2 > {this.state.currentMeme.name} </h2>

          <div className="imageNumber" > </div>
          <img src={this.state.currentMeme.url}
            alt="Target" />
        </div>

        <button onClick={this.prevButton} id="prevButton" > ❮ </button>
        <button onClick={this.nextButton} id="nextButton" > ❯ </button>
        <div id="inputText" > </div> <div id="inputColor" > </div>
      </div>

      <button onClick={this.retrieveBoxes} id="generateButton" > Generate </button>
      <ResultComponent URL={this.props.URL} Meme={this.state.currentMeme} /> </div>
    )
  }
}




export default ImageViewComponent;