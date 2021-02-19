import ImageOptionsText from './ImageOptionsText';
const React = require('react');
require('./BrowseViewComponent.css');

class BrowseViewComponent extends React.Component {
  
  state = {
    allMemes: [],
    popularMemes: []
  }

  componentWillMount() {
    this.getAllMemes(); 
    this.getPupularMemes();
  }

  createMemes(){
    console.log(this.state.allMemes)
    if(this.state.allMemes !== undefined){
    return(
      this.state.allMemes.map((object, i) =>
          <div><ImageOptionsText meme={this.state.allMemes[i]}/></div>
      )
    )}
    else{
      return (
        <p>nicht gefunden</p>
      )
    }
  }

  /**
   * Memes Array sorted by time of creation
   */
  getAllMemes(){
    fetch('http://localhost:3000/memes/browsememes').then(response => {
      return response.json();
    })
    .then(data => {
      //console.log("data: " + JSON.stringify(data))
      this.setState({allMemes: data})//, () => this.createMemes(this.state.allMemes))
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Memes Array sorted by number of upvotes
   */
  getPupularMemes(){
    fetch('http://localhost:3000/memes/popularmemes').then(response => {
      return response.json();
    })
    .then(data => {
      //console.log("data popularmemes: " + JSON.stringify(data))
      this.setState({popularMemes: data})//, () => this.createMemes(this.state.popularMemes))
    }).catch(error => {
      console.log(error);
    });
  }




  render() {
    return (

      <div className="imageOptions_container">
        <div id= "test">
          {this.createMemes()}
        </div>
      </div>
    );
  }
}




export default BrowseViewComponent;
