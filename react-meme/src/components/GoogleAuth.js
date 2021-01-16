
import React from 'react';

import { GoogleLogin, GoogleLogout } from 'react-google-login';


const CLIENT_ID =
    '89707895112-7ekjj49i0ibag5dra96jrr8gcfajj89l.apps.googleusercontent.com';

class GoogleAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogined: false,
            accessToken: ''
        };
        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }
    login(response) {
        if (response.accessToken) {
            this.setState(state => ({
                isLogined: true,
                accessToken: response.accessToken
            }));
            this.props.setUser(this.state.accessToken, this.state.isLogined)
        }
    }

    logout(response) {
        this.setState(state => ({
            isLogined: false,
            accessToken: ''
        }));
        this.props.setUser(this.state.accessToken, this.state.isLogined)
    }

    handleLoginFailure(response) {
        alert('Log in failed! Please try again')
    }

    handleLogoutFailure(response) {
        alert('Log out failed! Please try again')
    }

    render() {
        return (
            <div>
                { this.state.isLogined ?
                    <GoogleLogout
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} class="button">Log Out</button>
                          )}
                        buttonText='Logout'
                        onLogoutSuccess={this.logout}
                        onFailure={this.handleLogoutFailure}
                    >
                    </GoogleLogout> : <GoogleLogin
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} class="button">Log In</button>
                        )}
                        buttonText='Login'
                        onSuccess={this.login}
                        onFailure={this.handleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                        responseType='code,token'
                    />
                }
            </div>
        )
    }
}

export default GoogleAuth;