import SliderComponent from '../../Slider/SliderComponent';

const React = require('react');
require('./PreviewComponent.css');

class PreviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      urlArray: []
    }
    this.selectedImage = this.selectedImage.bind(this)
  }

  componentDidUpdate(prevProps){
    if(this.props.samplesMemeArray !== prevProps.samplesMemeArray) {
      this.getUrls()
    }
  }

  loadPreviewItem(x) {
    //get Pos
    var currentArrayPos = this.props.indexPos;
    var previewElement = currentArrayPos + x;

    return this.props.samplesMemeArray[previewElement].url;
  }


  getUrls(){
    if(this.props.samplesMemeArray === null){
      return
    }
    var urlArray = [];
  
    for(var i= 0; i<this.props.samplesMemeArray.length; i++){
      urlArray.push(this.props.samplesMemeArray[i].url)
    }
    console.log ("urlArray   :" + urlArray)
    this.setState({
      urlArray
    })
  }

  selectedImage(index){
    this.setState({index: index})
    this.props.setCurrentMemeState(index)
  }


  render() {
    return (

      <div className="preview-box">
        <SliderComponent memesArray = {this.state.urlArray} selectedImage = {this.selectedImage} optionsComponent = {false}/>
      </div>
      
    )
  }
}


export default PreviewComponent;
