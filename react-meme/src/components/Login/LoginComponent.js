import GoogleAuth from './GoogleAuth';
import UserAuth from './UserAuth';
const React = require('react');
require('./LoginComponent.css');


class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="login-view">
                <UserAuth />
                <GoogleAuth />
            </div>
        );
    }
}

export default LoginComponent;