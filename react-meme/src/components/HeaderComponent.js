import GoogleAuth from './GoogleAuth';
import { Link } from 'react-router-dom'
const React = require('react');
require('./HeaderComponent.css');


class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div class="header-view">
                <div id="menu-view">
                    <Link to="/" class="menu-item"> Generator </Link>
                    <Link to="/browse" class="menu-item"> Browse </Link>
                </div>
                <div id="title-view">MemeLab</div>
                <div id="account-view">
                    
                <Link to="/profile" class="menu-item"> Profile </Link>
                    <GoogleAuth />
                </div> </div>
        );
    }
}

export default HeaderComponent;