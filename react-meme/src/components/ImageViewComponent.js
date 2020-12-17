
const React = require('react');
require('./ImageViewComponent.css');

class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    //Button Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.generateMeme = this.generateMeme.bind(this);
    this.currentImage = this.currentImage.bind(this);
  }

  //Buttons
  currentImage() {
    //fetch(this.props.URL + '/samplememes').then(response => response.json()).then((data) => console.log('this is your data', data));
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
     
            <div class="imageNumber"></div>

            <p>Loading, please wait...</p>

          </div>

          <button onClick={this.prevButton} id="prevButton" >❮</button>
          <button onClick={this.nextButton} id="nextButton" >❯</button>

          <button onClick={this.currentImage}>Generate</button>
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
