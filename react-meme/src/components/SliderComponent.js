import ImageAndOptions from './ImageAndOptions';
const React = require('react');
//const { default: ImageAndOptions } = require('./ImageAndOptions');
require('./SliderComponent.css');

class SliderComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageContainerArray: new Array(4), // sichtbare Bilder in Array
      indexArray: 0
    }
    this.createImages = this.createImages.bind(this)
    this.createImageContainers = this.createImageContainers.bind(this)
    //this.handleClick = this.handleClick.bind(this)

  }

  // befülle beim Laden der Seite leere Container mit Bildern nach indexposition 0
  componentDidMount() { this.createImages(this.state.indexArray); console.log("did mount") }

  createImages(x) {
    // erstelle neues Array welches dann Ausgangsstatus für onClick ist
    var memesArray2 = [];
    // 0 - Anzahl angezeigter Bilder
    for (var i = 0; i < this.state.imageContainerArray.length; i++) {
      // linkes Bild + Position Bild +- angezeigte Bilder(4)
      // + länge % länge -> Rest: bei Array von vorne anfangen
      memesArray2[i] = this.props.memesArray[(this.state.indexArray + i + x + (this.props.memesArray.length)) % this.props.memesArray.length]

    }
    console.log("IndexArray: " + this.state.indexArray)
    //update sichtbares Array, IndexPosition Bild ganz links
    this.setState({ imageContainerArray: memesArray2, indexArray: (this.state.indexArray + x + (this.props.memesArray.length)) % this.props.memesArray.length })
  }

  /**
   * create empty image containers
   */
  createImageContainers() {
    console.log("image Containers")
    return (
      this.state.imageContainerArray.map((element, i) =>
        <div className="imageAndOptions"><img src={element} className="images" onClick= {this.handleClick.bind(this, i)}/><ImageAndOptions /></div>
        
      ))

  }

  handleClick(i){
    console.log(i)
    this.props.selectedImage((this.state.indexArray + i + (this.props.memesArray.length)) % this.props.memesArray.length)
    
  }


  render() {
    return (
      <div>

        <div className="container_images" >
          <button className="button" onClick={() => this.createImages(-this.state.imageContainerArray.length)}>&lsaquo;</button>
          <div>{this.createImageContainers()}</div>

          <button className="button" onClick={() => this.createImages(this.state.imageContainerArray.length)}>&rsaquo;</button>
        </div>

      </div>

    )
  }
}


export default SliderComponent;
