
import SearchComponent from './components/SearchComponent';
import ImageViewComponent from './components/ImageViewComponent';
import AdjustmentComponent from './components/AdjustmentComponent';
import PreviewComponent from './components/PreviewComponent';
const React = require('react');
require('./App.css');



class App extends React.Component {

  render() {
    return (
      <div>
        <SearchComponent />
        <ImageViewComponent />
        <AdjustmentComponent />
        <PreviewComponent />
      </div>
    );
  }

}



export default App;
