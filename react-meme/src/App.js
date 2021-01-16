import ImageViewComponent from './components/ImageViewComponent';
import HeaderComponent from './components/HeaderComponent';
import Meme from './components/Meme'
const React = require('react');
require('./App.css');

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      URL: 'http://localhost:3000',
      isFetching: false,
      samplesMemeArray: [],
      accessToken: '',
      isLogined: false
    }
    this.fetchImages = this.fetchImages.bind(this);
  }

  // Called when window is loaded
  componentDidMount() {
    // Start fetching
    this.setState({
      isFetching: true
    });
    //window.addEventListener('load', this.fetchImages);
    this.fetchImages();
  }

  // Fetch all images from /samplememes and store them into a state array
  fetchImages() {
    fetch(this.state.URL + '/memes/sampleMemes')
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Fetching Memes...")
        let tmpArray = []
          for (var i = 0; i < data.length; i++) {
            var tmp = new Meme();
            tmp.id = data[i].id
            tmp.name = data[i].name
            tmp.box_count = data[i].box_count
            tmp.width = data[i].width
            tmp.height = data[i].height
            tmp.url = data[i].url
            tmpArray.push(tmp)
          }
        // Populate Meme Array
        this.setState({
          samplesMemeArray: tmpArray,
          isFetching: false
        })
        console.log("Fetching Memes is done!")
      }).catch(error => {
        console.log(error);
        // finish fetchnig
        this.setState({
          isFetching: false
        })
      });
  }

  setUser(accessToken, isLogined){
    this.setState({
      accessToken: accessToken,
      isLogined: isLogined
    })
  }

  render() {
    
    if (this.state.isFetching)
      return <div class="App"> Loading... </div>;
    if (this.state.samplesMemeArray.length === 0)
      return <div class="App"> There seems to be no connection to the server! </div>;
    return <div class="App"> <HeaderComponent setUser = {(accessToken, isLogined) => this.setUser(accessToken, isLogined)}/><ImageViewComponent URL={this.state.URL} samplesMemeArray={this.state.samplesMemeArray} accessToken={this.state.accessToken} isLogined={this.state.isLogined}/> </div>
  }
}

export default App;