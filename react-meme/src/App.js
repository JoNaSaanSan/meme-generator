
import ImageViewComponent from './components/ImageViewComponent';
import PreviewComponent from './components/PreviewComponent';
const React = require('react');
require('./App.css');



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      URL: 'http://localhost:3000',
      isFetching: false,
      samplesMemeArray: [],
    }
    this.fetchImages = this.fetchImages.bind(this);
  }

  // Called when window is loaded
  componentDidMount() {
    // staring your fetching
    this.setState({ isFetching: true });
    window.addEventListener('load', this.fetchImages);
  }

  // fetch all images from /samplememes and store them into a state array
  fetchImages() {
    fetch(this.state.URL + '/samplememes')
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Fetching Memes...")
        let tmpArray = []
        for (var i = 0; i < data.length; i++) {
          tmpArray.push(data[i])
        }

        this.setState({
          samplesMemeArray: tmpArray,
          isFetching: false
        })
        console.log("Fetching Memes is done!")
      }).catch(error => {
        // finish fetchnig
        this.setState({ isFetching: false })
      });
  }


  render() {
    if (this.state.isFetching) return <div>Loading...</div>;
    if (this.state.samplesMemeArray.length === 0) return <div>There seems to be no connection to the server!</div>;

    return <div>
      <ImageViewComponent URL={this.state.URL} samplesMemeArray={this.state.samplesMemeArray} />
      <PreviewComponent />
    </div>

  }

}



export default App;
