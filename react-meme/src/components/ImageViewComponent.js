
const React = require('react');
require('./ImageViewComponent.css');

class ImageViewComponent extends React.Component {



  render() {
    return (
      <div>

        <div id="slideShowImages">
          <div class="imageNumber"></div>

          <p>Loading, please wait...</p>

        </div>

        <button id="backButton">❮</button>
        <button id="nextButton">❯</button>
      </div>
    )
  }
}




export default ImageViewComponent;
