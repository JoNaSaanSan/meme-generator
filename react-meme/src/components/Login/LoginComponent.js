import UserAuth from './UserAuth';
const React = require('react');
require('./LoginComponent.css');


class LoginComponent extends React.Component {



    render() {
        return (
            <div className="login-view">
                <UserAuth />
            </div>
        );
    }
}

export default LoginComponent;