
import SearchComponent from './components/SearchComponent';
import ImageViewComponent from './components/ImageViewComponent';
import AdjustmentComponent from './components/AdjustmentComponent';
import PreviewComponent from './components/PreviewComponent';
const React = require('react');
require('./App.css');



class App extends React.Component {
  constructor() {
    super()
    this.state = {
      URL: 'http://localhost:3000',
      
    }


  }

  //Get All Sample Memes
  fetchImages() {
    fetch(this.state.URL + '/samplememes').then(response => response.json()).then((data) => {
      console.log('this is your data', data)

    });
  }

  render() {
    this.fetchImages();
    return (
      <div>
        <SearchComponent />
        <ImageViewComponent URL={this.state.URL} />
        <AdjustmentComponent />
        <PreviewComponent />

      </div>
    );
  }

}



export default App;
