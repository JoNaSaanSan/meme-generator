import ImageUploader from 'react-images-upload';
import UploadComponent from './UploadComponent';
const React = require('react');
require('./ControlsComponent.css');


class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pictures: [],
      selectImageMode: "ïmgFlip",
    };
    this.onDrop = this.onDrop.bind(this);

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.uploadButton = this.uploadButton.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.createUI = this.createUI.bind(this);
    this.generateMemeButton = this.generateMemeButton.bind(this);
    this.changeImageMode = this.changeImageMode(this);

  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: pictureFiles
    });
  }

  //Set new index with step
  setNewIndex(step) {
    var newIndex = (this.props.index + step + (this.props.samplesMemeArray.length)) % (this.props.samplesMemeArray.length)
    this.props.setCurrentMemeState(newIndex)
  }

  // Previous Button
  prevButton() {
    this.setNewIndex(-1)
  }

  // Next Button
  nextButton() {
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
        <input type="text" placeholder="Text" name="text" className="input-box" onChange={this.props.handleChange(i)} />
        <input type="text" placeholder="50" name="fontSize" className="number-input-box" min="1" max="100" maxLength="2" onChange={this.props.handleChange(i)} />
        <select name="fontFamily" className="input-box" onChange={this.props.handleChange(i)}>
          <option value="Impact">Impact</option>
          <option value="Arial">Arial</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Courier">Courier</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <input type="color" name="fontColor" className="color-input-box" value={this.props.inputBoxes[i].fontColor} onChange={this.props.handleChange(i)} />
      </div>)
  }

  //Generate Meme Button
  generateMemeButton() {
    this.props.generateMeme();
  }

 /* uploadedImage(img) {
    console.log(img);
   // changeImageMode("uploadedImage");
  }*/

  changeImageMode(mode) {

   // this.props.changeImageMode(mode);
  }



  // Render
  render() {
    return (
      <div id="control-view">
        <div className="inner-grid" id="left-container">
          <h1 id="header-text"> Meme Generator </h1>
          <div id="select-img-buttons">
            <button  id="select-img-flip-button" className="button" > Img Flip </button>
            <UploadComponent uploadedImage={this.uploadedImage} />
            <button id="select-img-url-button" className="button" > URL </button>
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