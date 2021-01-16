
const React = require('react');
require('./PreviewComponent.css');

class PreviewComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (

      <div>
        {this.props.currentMeme.id}
      </div>
    )
  }
}




export default PreviewComponent;
