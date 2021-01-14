import Login from './Login';
import Logout from './Logout';

const React = require('react');
require('./HeaderComponent.css');



class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<div> <Login /> <Logout /></div>);
    }
}

export default HeaderComponent;