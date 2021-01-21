import GoogleAuth from './GoogleAuth';
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
                    <div class="menu-item">Generator</div>
                    <div class="menu-item">Browse</div>
                </div>
                <div id="title-view">MemeLab</div>
                <div id="account-view">
                    
                    <div class="menu-item">Profile</div>
                    <GoogleAuth />
                </div> </div>
        );
    }
}

export default HeaderComponent;