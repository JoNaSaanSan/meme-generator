import LoginComponent from './Login/LoginComponent';
import Store from '../redux/store';
import { Link } from 'react-router-dom'
const React = require('react');
require('./HeaderComponent.css');


class HeaderComponent extends React.Component {

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
                    <a className="button" href="#login">Login</a>
                    <div id="login" className="modal-window">
                        <div>
                            <a href="/#" title="Close" id="login-close" className="modal-close">Close</a>
                            <LoginComponent />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HeaderComponent;