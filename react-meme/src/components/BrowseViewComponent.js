import ImageOptionsText from './ImageOptionsText';
const React = require('react');
require('./BrowseViewComponent.css');

class BrowseViewComponent extends React.Component {


  render() {

    return (

      <div className="imageOptions_container">
        <div>
          <ImageOptionsText/>
        </div>
      </div>
    )
  }
}




export default BrowseViewComponent;
