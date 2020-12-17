const React = require('react');
const {
  default: ResultComponent
} = require('./ResultComponent');
require('./ImageViewComponent.css');


class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Index of array
    this.index = 0;

    // Init state
    this.state = {
      currentID: '',
      currentName: '',
      currentBoxCount: '',
      currentWidth: '',
      currentHeight: '',
      currentImgURL: '',
      currentBoxes: '',
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
  setCurrentMemeState(index) {

    this.setState({
      currentID: this.props.samplesMemeArray[index].width,
      currentName: this.props.samplesMemeArray[index].name,
      currentBoxCount: this.props.samplesMemeArray[index].box_count,
      currentWidth: this.props.samplesMemeArray[index].width,
      currentHeight: this.props.samplesMemeArray[index].height,
      currentImgURL: this.props.samplesMemeArray[index].url,
    })

    this.createInputBoxes(this.props.samplesMemeArray[index].box_count)

  }



  // Previous Button
  prevButton() {
    console.log(this.props.samplesMemeArray[this.index])
    this.index = (this.index + (this.props.samplesMemeArray.length) - 1) % (this.props.samplesMemeArray.length)
    this.setCurrentMemeState(this.index)
  }

  // Next Button
  nextButton() {
    this.index = (this.index + (this.props.samplesMemeArray.length) + 1) % (this.props.samplesMemeArray.length)
    this.setCurrentMemeState(this.index)
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


  render() {
    return ( <
      div >
      <
      div >
      <
      input type = "text"
      id = "searchText" / > <
      button id = "searchButton"
      onClick = {
        this.searchImage
      } > Search < /button> < /
      div >

      <
      div className = "Create" >
      <
      div id = "slideShowImages" >
      <
      h2 > {
        this.state.currentName
      } < /h2>

      <
      div className = "imageNumber" > < /div> <
      img src = {
        this.state.currentImgURL
      }
      alt = "Target" / >

      <
      /div>

      <
      button onClick = {
        this.prevButton
      }
      id = "prevButton" > ❮ < /button> <
      button onClick = {
        this.nextButton
      }
      id = "nextButton" > ❯ < /button>

      <
      div id = "inputText" > < /div> <
      div id = "inputColor" > < /div>

      <
      /div>

      <
      button onClick = {
        this.retrieveBoxes
      }
      id = "generateButton" > Generate < /button> <
      ResultComponent URL = {
        this.props.URL
      } {
        ...this.state
      }
      /> < /
      div >
    )
  }
}




export default ImageViewComponent;