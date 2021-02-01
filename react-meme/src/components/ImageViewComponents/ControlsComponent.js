import ImageUploader from 'react-images-upload';
import UploadComponent from './UploadComponent';
const React = require('react');
<<<<<<< HEAD
var nodefetch = require('node-fetch')
=======
require('./ControlsComponent.css');
>>>>>>> 80c940555f23d76fb779e2e3a99e05a922d48475


class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pictures: []
    };
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
    //
    function upload(url, picture) {
      console.log(picture);
      const form = new FormData();
      form.append('file', picture);
      console.log(form)
      return fetch(url, {
        method: 'POST',
        body: form
      }).then(() => console.log("done"));
    }
    this.state.pictures.map(picture => upload("localhost:3000/memes/uploadtemplate", picture));
    //
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
<<<<<<< HEAD
      <
      div key = {
        i
      } >
      <
      input type = "text"
      class = "text-box"
      onChange = {
        this.props.handleChange(i)
      }
      /> <
      input type = "color"
      class = "color-box"
      onChange = {
        this.props.handleChange(i)
      }
      /> < /
      div > )
=======
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
>>>>>>> 80c940555f23d76fb779e2e3a99e05a922d48475
  }

  //Generate Meme Button
  generateMemeButton() {
    this.props.generateMeme();
  }

  // Render
  render() {
<<<<<<< HEAD
    console.log(this.state);
    return ( <
      div id = "control-view" >
      <
      div class = "inner-grid"
      id = "left-container" >
      <
      h1 id = "header-text" > Meme Generator < /h1> <
      input type = "text"
      id = "search-text-box"
      class = "text-box" / >
      <
      button id = "search-button"
      class = "button"
      onClick = {
        this.searchImage
      } > Search < /button> <
      button onClick = {
        this.prevButton
      }
      id = "prev-button"
      class = "button" > Back < /button> <
      button onClick = {
        this.nextButton
      }
      id = "next-button"
      class = "button" > Next < /button> <
      button onClick = {
        this.generateMemeButton
      }
      id = "generate-button"
      class = "button" > Generate < /button> <
      div id = "upload-button" > < ImageUploader withIcon = {
        false
      }
      withPreview = {
        true
      }
      buttonText = 'Choose images'
      onChange = {
        this.onDrop
      }
      imgExtension = {
        ['.jpg', '.gif', '.png', '.gif']
      }
      maxFileSize = {
        5242880
      }
      /> <
      button id = "upload-button"
      class = "button"
      onClick = {
        this.uploadButton
      } > upload < /button> < /
      div > <
      /div> <
      p > Insert text below < /p> <
      div id = "ui-buttons" > {
        this.createUI()
      } < /div> < /
      div >
=======
    return (
      <div id="control-view">
        <div className="inner-grid" id="left-container">
          <h1 id="header-text"> Meme Generator </h1>
          <input type="text" id="search-text-box" class="input-box" />
          <button id="search-button" class="button" onClick={this.searchImage}> Search </button>
          <button onClick={this.prevButton} id="prev-button" className="button" > Back </button>
          <button onClick={this.nextButton} id="next-button" className="button" > Next </button>
          <button onClick={this.generateMemeButton} id="generate-button" className="button" > Generate</button>
          <div id="upload-button" > <ImageUploader
            withIcon={false}
            withPreview={true}
            buttonText='Choose images'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />

          <UploadComponent />
          </div>
        </div>
        <p>Insert text below </p>
        <div id="ui-buttons-description"> <div>Text</div><div>Font Size</div><div>Font Family</div><div>Color</div></div>
        <div id="ui-buttons"> {this.createUI()}</div>
      </div>
>>>>>>> 80c940555f23d76fb779e2e3a99e05a922d48475
    )
  }
}

export default ControlsComponent;