const React = require('react');
require('./SliderComponent.css');

class SliderComponent extends React.Component {

  constructor(props) {
    super(props);
    this.createImages = this.createImages.bind(this)
  }

  createImages(x) {
    console.log(this.props.memesArray.slice(0+x,4+x).map((element)=><div> <img src= {element} className="images"/></div>) )

    console.log("wird aufgerufen")
   
    //löschen
    while(document.getElementById('images')!= null){
        var images = document.getElementById('images');
        //images.parentNode.removeChild(images);
        images.remove();
        console.log("lösche")
    }
    /*
    
window.onload = () => {
    var newArr =[]
    newArr.push(this.props.memesArray.slice(0+x,4+x))
    newArr.forEach (function (value, index) {
        const img = new Image();
        img.src = newArr[index] ;
        document.getElementById("test").appendChild(img);
     });
    }*/
/*

    for(var i=0; i< newArr.length; i++){

        var image = document.createElement('img');
        image.setAttribute('src', this.props.memesArray[i])
        image.setAttribute('className', "images");
    }
    /*
        .map((element)=> 
            <div id="images"> <img src= {element} className="images"/></div>) //erzeuge aus url - Array Bilder

    var image = document.createElement('img');
    image.setAttribute('src', './images/logo.png');
    image.src = './images/logo.png'; // Alternative!
*/

    return(
        this.props.memesArray
        .slice(0+x,4+x) //nur die ersten 4 Biler (Arraystellen)
        .map((element)=> 
            <div id="images"> <img src= {element} className="images"/></div>) //erzeuge aus url - Array Bilder

    )
     
  }


  
  render() {
    return (
        <div>

            <div className="container_images" >
                <button className="button" >&lsaquo;</button>
                {this.createImages(0)}
                <div id="test"></div>
                <button className="button" onClick={() => this.createImages(4)} >&rsaquo;</button>
            </div>

            
        </div>

    )
  }
}


export default SliderComponent;
