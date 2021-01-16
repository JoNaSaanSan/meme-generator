import GoogleAuth from './GoogleAuth';

const React = require('react');
require('./HeaderComponent.css');



class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    setUser(accessToken, isLogined) {
        this.props.setUser(accessToken, isLogined)
    }

    render() {
        return (
            <div class="header-view">
                <div id="menu-view">
                    <div class="menu-item">Generator</div>
                    <div class="menu-item">Browse</div>
                </div>
                <div id="title-view">MemeLab</div>
                <div id="account-view">
                    <div class="menu-item">Profile</div>
                    <GoogleAuth setUser={(accessToken, isLogined) => this.setUser(accessToken, isLogined)} />
                </div> </div>
        );
    }
}

export default HeaderComponent;