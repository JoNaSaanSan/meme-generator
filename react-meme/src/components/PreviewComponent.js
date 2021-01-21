
const React = require('react');
require('./PreviewComponent.css');

class PreviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.loadPreviewItem = this.loadPreviewItem.bind(this)
  }


  loadPreviewItem(x){
    /*
    for(var i=this.props.currentMeme.id -2; i< this.props.currentMeme.id +3; i++) {
      var numberOfImages;

      var previewMeme = document.getElementById("preview1");
      previewMeme.src= "" + this.props.currentMeme.url;
    }*/
 //var previewMeme = this.props.currentMeme.id + x;
    //var currentMemePos = this.props.samplesMemeArray.indexOf(this.props.currentMeme.id)



    //ObjectsArray
    console.log(JSON.stringify(this.props.currentMeme))

    //100 images
    var numberOfImages = this.props.samplesMemeArray.length
    console.log("numberofimages :" + numberOfImages)


    //get Pos
    var currentArrayPos = this.props.samplesMemeArray.map(function(e) { return e.id; }).indexOf(this.props.currentMeme.id);
    console.log("current pos : " + currentArrayPos)
    var previewElement = currentArrayPos + x;
    //this.props.samplesMemeArray[previewElement].url

    
    return this.props.samplesMemeArray[previewElement].url;
  }

  previewSelected(){
    console.log("SSSSSSSELLLLLCECCCCCCCTED");
    console.log("this: " + this)
    //currentMeme=
  }

  render() {
    return (

      <div className="preview-box">
        <img src = {this.loadPreviewItem(1)} className="images" onClick= {this.props.setCurrentMemeState(2)}/>
        <img src = {this.loadPreviewItem(2)} className="images"/>
        <img src = {this.loadPreviewItem(3)} className="images"/>
        <img src = {this.loadPreviewItem(4)} className="images"/>
        {this.loadPreviewItem}
      </div>
    )
  }
}
//onClick= {this.props.setCurrentMemeState(2)




export default PreviewComponent;
