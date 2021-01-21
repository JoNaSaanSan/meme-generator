import GeneratorComponent from './components/GeneratorComponent';
import HeaderComponent from './components/HeaderComponent';
import ProfileViewComponent from './components/ProfileViewComponent';
import { Switch, Route } from 'react-router-dom';
const React = require('react');
require('./App.css');

class App extends React.Component {

  render() {
    return (
      <div>
        <HeaderComponent />
        <Switch>
          <Route path="/" component={GeneratorComponent} exact />
          <Route path="/profile" component={ProfileViewComponent} />
          <Route component={Error} />
        </Switch>

      </div>
    )
  }
}

export default App;