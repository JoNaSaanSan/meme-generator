import ImageOptionsText from './ImageOptionsText';
const React = require('react');
require('./BrowseViewComponent.css');

class BrowseViewComponent extends React.Component {
  
  state = {
    allMemes: []
  }

  componentDidMount() {
    this.getAllMemes(); 
  }

  createAllMemes(){
    console.log("allMemes ausgeben :"+ this.state.allMemes);
    if(this.state.allMemes == !undefined){
    
    return(
      this.state.allMemes.map((i) =>
          <div ><img src="https://www.scinexx.de/wp-content/uploads/s/c/schrumpfeng-1.jpg"/><ImageOptionsText title={this.state.allMemes[i].title}/></div>
          
        )
    )
    }
  }

  getAllMemes(){
    fetch('http://localhost:3000/memes/browsememes').then(response => {
      return response.json();
    })
    .then(data => {
      console.log("data: " + JSON.stringify(data))
      this.setState({allMemes: data}, () => this.createAllMemes())
    }).catch(error => {
      console.log(error);
    });
  }


  render() {
    return (

      <div className="imageOptions_container">
        <div id= "test">
          {this.createAllMemes()}
          <ImageOptionsText/>
        </div>
      </div>
    );
  }
}




export default BrowseViewComponent;
