const React = require('react');
require('./PreviewComponent.css');

class PreviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.previewSelected = this.previewSelected.bind(this)
  }


  loadPreviewItem(x) {
    //get Pos
    var currentArrayPos = this.props.indexPos;

    var previewElement = (currentArrayPos + x + this.props.samplesMemeArray.length) % this.props.samplesMemeArray.length;

    return this.props.samplesMemeArray[previewElement].url;
  }

  previewSelected(x) {
    this.props.setCurrentMemeState((this.props.indexPos + x + this.props.samplesMemeArray.length)  % this.props.samplesMemeArray.length)
  }

  render() {
    return (

      <div className="preview-box">
        <img src={this.loadPreviewItem(-2)} className="images" onClick={() => this.previewSelected(-2)} />
        <img src={this.loadPreviewItem(-1)} className="images" onClick={() => this.previewSelected(-1)} />
        <img src={this.loadPreviewItem(0)} className="images" onClick={() => this.previewSelected(0)} />
        <img src={this.loadPreviewItem(1)} className="images" onClick={() => this.previewSelected(1)} />
        <img src={this.loadPreviewItem(2)} className="images" onClick={() => this.previewSelected(2)} />
      </div>
    )
  }
}


export default PreviewComponent;
