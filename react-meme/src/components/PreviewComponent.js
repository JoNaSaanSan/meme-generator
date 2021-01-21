
const React = require('react');
require('./PreviewComponent.css');

class PreviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.previewSelected = this.previewSelected.bind(this)
  }


  loadPreviewItem(x){
    //get Pos
    var currentArrayPos = this.props.indexPos;
    console.log("current pos : " + currentArrayPos)
    var previewElement = currentArrayPos + x;
    
    return this.props.samplesMemeArray[previewElement].url;
  }

  previewSelected(x){
    this.props.setCurrentMemeState(this.props.indexPos + x)
  }

  render() {
    return (

      <div className="preview-box">
        <img src = {this.loadPreviewItem(1)} className="images" onClick= {() => this.previewSelected(1)}/>
        <img src = {this.loadPreviewItem(2)} className="images" onClick= {() => this.previewSelected(2)}/>
        <img src = {this.loadPreviewItem(3)} className="images" onClick= {() => this.previewSelected(3)}/>
        <img src = {this.loadPreviewItem(4)} className="images" onClick= {() => this.previewSelected(4)}/>
      </div>
    )
  }
}


export default PreviewComponent;
