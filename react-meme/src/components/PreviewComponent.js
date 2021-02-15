import SliderComponent from './SliderComponent';

const React = require('react');
require('./PreviewComponent.css');

class PreviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
    this.selectedImage = this.selectedImage.bind(this)
  }


  loadPreviewItem(x) {
    //get Pos
    var currentArrayPos = this.props.indexPos;
    var previewElement = currentArrayPos + x;

    return this.props.samplesMemeArray[previewElement].url;
  }


  getUrls(){
    var urlArray = [];
    console.log ("urlArray   :" + urlArray)
    for(var i= 0; i<this.props.samplesMemeArray.length; i++){
      urlArray.push(this.props.samplesMemeArray[i].url)
    }
    console.log ("urlArray   :" + urlArray)
    return urlArray;
  }

  selectedImage(index){
    this.setState({index: index})
    this.props.setCurrentMemeState(index)
  }


  render() {
    return (

      <div className="preview-box">

        {this.getUrls}
        <SliderComponent memesArray = {this.getUrls()} selectedImage = {this.selectedImage} optionsComponent = {false}/>
      </div>
      
    )
  }
}


export default PreviewComponent;
