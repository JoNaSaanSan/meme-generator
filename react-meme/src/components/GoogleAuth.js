
import React from 'react';
import { connect } from 'react-redux';
import { authenticateUser } from '../redux/action'
import Store from '../redux/store';
import { GoogleLogin, GoogleLogout } from 'react-google-login';


const CLIENT_ID =
    '89707895112-7ekjj49i0ibag5dra96jrr8gcfajj89l.apps.googleusercontent.com';

// Redux: AUTHENTICATE USER
function mapDispatchToProps(dispatch) {
    return {
        authenticateUser: user => dispatch(authenticateUser(user))
    };
}

class GoogleAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSignedIn: Store.getState().user.isSignedIn,
        }

        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }
    // Handle Login
    login(response) {
        console.log(response)
        if (response.accessToken) {
            this.props.authenticateUser({ name: response.profileObj.name, email: response.profileObj.email, id: response.profileObj.googleId, accessToken: response.accessToken, isSignedIn: true })
        }
    }



    // Handle Log out
    logout(response) {
        this.props.authenticateUser({ name: '', email: '', id:'', accessToken: '', isSignedIn: false })
    }


    handleLoginFailure(response) {
        alert('Log in failed! Please try again')
    }

    handleLogoutFailure(response) {
        alert('Log out failed! Please try again')
    }

    render() {
   // Redux: Update Signed in State
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

        return (
            <div>
                {  this.state.isSignedIn ?
                    <GoogleLogout
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="button">Log Out</button>
                          )}
                        buttonText='Logout'
                        onLogoutSuccess={this.logout}
                        onFailure={this.handleLogoutFailure}
                    >
                    </GoogleLogout> : <GoogleLogin
                        clientId={CLIENT_ID}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="button">Log In</button>
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



export default connect(null, mapDispatchToProps)(GoogleAuth);