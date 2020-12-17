
const React = require('react');
require('./ImageViewComponent.css');

class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      data: this.props.URL
    }

    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.generateMeme = this.generateMeme.bind(this);
    this.currentImage = this.currentImage.bind(this);
  }

  currentImage() {
    fetch( this.state.data + '/').then(response => response.json())
  }

  prevButton() {
    // do something

  }

  nextButton() {
    // do something
  }

  generateMeme() {
    // do something
  }


  render() {
    return (
      <div>
        <div class="Create">
          <div id="slideShowImages">
            <img src={this.currentImage}></img>
            <div class="imageNumber"></div>

            <p>Loading, please wait...</p>

          </div>

          <button onClick={this.prevButton} id="prevButton" >❮</button>
          <button onClick={this.nextButton} id="nextButton" >❯</button>

          <button onclick={this.generateMeme}>Generate</button>
        </div>

        <div class="Result">
          <div id="resultImage">
            <div class="resultImageNumber"></div>
            <p>Nothing generated yet.</p>
          </div>
        </div>
      </div >
    )
  }
}




export default ImageViewComponent;
