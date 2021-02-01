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
            <div className="header-view">
                <div id="menu-view">
                    <Link to="/" className="menu-item"> Generator </Link>
                    <Link to="/browse" className="menu-item"> Browse </Link>
                </div>
                <div id="title-view">MemeLab</div>
                <div id="account-view">
                    
                <Link to="/profile" className="menu-item"> Profile </Link>
                    <GoogleAuth />
                </div> </div>
        );
    }
}

export default HeaderComponent;