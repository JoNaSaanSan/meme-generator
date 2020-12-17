
const React = require('react');
require('./ImageViewComponent.css');

class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Index of array
    this.index = 0;


    this.state = {
      currentID: this.props.samplesMemeArray[this.index].width,
      currentName: this.props.samplesMemeArray[this.index].name,
      currentBoxCount: this.props.samplesMemeArray[this.index].box_count,
      currentWidth: this.props.samplesMemeArray[this.index].width,
      currentHeight: this.props.samplesMemeArray[this.index].height,
      currentImgURL: this.props.samplesMemeArray[this.index].url,
    }

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.generateMeme = this.generateMeme.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
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

  generateMeme() {
    // do something
  }


  render() {
    return (
      <div>
        <div class="Create">
          <div id="slideShowImages">
            <h2> {this.state.currentName}</h2>

            <div class="imageNumber"></div>
            <img src={this.state.currentImgURL} alt="Target" />

          </div>

          <button onClick={this.prevButton} id="prevButton" >❮</button>
          <button onClick={this.nextButton} id="nextButton" >❯</button>

          <button onClick={this.currentImgURL}>Generate</button>
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
