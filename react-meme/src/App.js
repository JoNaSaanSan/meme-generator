
import SearchComponent from './components/SearchComponent';
import ImageViewComponent from './components/ImageViewComponent';
import AdjustmentComponent from './components/AdjustmentComponent';
import PreviewComponent from './components/PreviewComponent';
const React = require('react');
require('./App.css');



class App extends React.Component {
  constructor() {
    super();
    this.state = {
      URL: 'http://localhost:3000'
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <SearchComponent />
        <ImageViewComponent URL={ data } />
        <AdjustmentComponent />
        <PreviewComponent />
      </div>
    );
  }

}



export default App;
