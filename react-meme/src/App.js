import MemeGenerator from './components/MemeGenerator/MemeGenerator';
import HeaderComponent from './components/HeaderComponent';
import ProfileViewComponent from './components/ProfileViewComponent';
import BrowseViewComponent from './components/BrowseViewComponent';
import GalleryViewComponent from './components/GalleryViewComponent';
import { Switch, Route } from 'react-router-dom';
const React = require('react');
require('./App.css');

class App extends React.Component {

  render() {
    return (
      <div className="meme-app">
        <HeaderComponent />
        <Switch>
          <Route path="/" component={MemeGenerator} exact />
          <Route path="/browse" component={BrowseViewComponent} />
          <Route path="/gallery" component={GalleryViewComponent} />
          <Route path="/profile" component={ProfileViewComponent} />
          <Route component={Error} />
        </Switch>

      </div>
    )
  }
}

export default App;