import ImageUploader from 'react-images-upload';
const React = require('react');


class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.uploadButton = this.uploadButton.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.createUI = this.createUI.bind(this);
    this.generateMemeButton = this.generateMemeButton.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: pictureFiles
    });
  }

  //Set new index with step
  setNewIndex(step) {
    var newIndex = (this.props.index + step + (this.props.samplesMemeArray.length)) % (this.props.samplesMemeArray.length)
    console.log("index" + newIndex)
    this.props.setCurrentMemeState(newIndex)
  }

  // Previous Button
  prevButton() {
    this.setNewIndex(-1)
  }

  // Next Button
  nextButton() {
    console.log(this.state.pictures)
    this.setNewIndex(1)
  }


  // Upload Button
  uploadButton() {

  }

  // Search Function
  searchImage() {
    for (var i = 0; i < this.props.samplesMemeArray.length; i++) {
      if (this.props.samplesMemeArray[i].name.toLowerCase().includes(document.getElementById('search-text-box').value.toLowerCase())) {
        console.log("found " + i)
        this.props.setCurrentMemeState(i)
      }
    }
  }

  // Add Input Boxes (Text & Color) depending on the meme boxcount
  createUI() {
    return this.props.inputBoxes.map((el, i) =>
      <div key={i}>
        <input type="text" class="text-box" onChange={this.props.handleChange(i)} />
        <input type="color" class="color-box" onChange={this.props.handleChange(i)} />
      </div>)
  }

  //Generate Meme Button
  generateMemeButton() {
    this.props.generateMeme();
  }

  // Render
  render() {
    return (
      <div id="control-view">
        <div class="inner-grid" id="left-container">
          <h1 id="header-text"> Meme Generator </h1>
          <input type="text" id="search-text-box" class="text-box" />
          <button id="search-button" class="button" onClick={this.searchImage}> Search </button>
          <button onClick={this.prevButton} id="prev-button" class="button" > Back </button>
          <button onClick={this.nextButton} id="next-button" class="button" > Next </button>
          <button onClick={this.generateMemeButton} id="generate-button" class="button" > Generate</button>
          <div id="upload-button" > <ImageUploader
            withIcon={false}
            withPreview={true}
            buttonText='Choose images'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
          </div>
        </div>
        <p>Insert text below </p>
        <div id="ui-buttons"> {this.createUI()}</div>
      </div>
    )
  }
}

export default ControlsComponent;