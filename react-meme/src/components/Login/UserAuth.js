import { connect } from 'react-redux';
import { authenticateUser } from './../../redux/action'
import Store from './../../redux/store';
const React = require('react');

// Redux: AUTHENTICATE USER
function mapDispatchToProps(dispatch) {
    return {
        authenticateUser: user => dispatch(authenticateUser(user))
    };
}


class UserAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state =
        {
            isLoginMode: false,
            isRegisterMode: false,
            isSignedIn: false,
            URL: 'http://localhost:3000',
        }

    }

    handleOnClick(event) {
        if (event.target.name === 'loginMode') {
            this.setState({
                isRegisterMode: false,
                isLoginMode: true,
            })
        } else if (event.target.name === 'registerMode') {
            this.setState({
                isRegisterMode: true,
                isLoginMode: false,
            })
        } else if (event.target.name === 'login') {
            this.setState({
                isRegisterMode: false,
                isLoginMode: false,
            })
            this.login();
        } else if (event.target.name === 'register') {
            this.setState({
                isRegisterMode: false,
                isLoginMode: false,
            })
            this.register();
        } else {
            this.setState({
                isRegisterMode: false,
                isLoginMode: false,
            })
            this.logout();
        }
    }


    /**
     * Handle when user wants to login
     */
    login() {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        };
        fetch(this.state.URL + '/users/login', requestOptions)
            .then(async response => {
                const data = await response.json();
                // check for error response
                if (!response.ok) {
                    alert('user does not exist')
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('email', data.email);
                localStorage.setItem('username', data.username);
                this.props.authenticateUser({ username: data.username, email: data.email, accessToken: data.accessToken, isSignedIn: true })
                console.log(data);
                document.getElementById("login-close").click();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }


    /**
     * Handle when user registers
     */
    register() {
        var email = document.getElementById("email").value;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var password2 = document.getElementById("password2").value;

        if (password !== password2) {
            alert("passwords dont match")
        } else {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, username: username, password: password })
            };

            console.log(requestOptions)
            fetch(this.state.URL + '/users/register', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log(data);
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    logout() {
        this.props.authenticateUser({ username: '', email: '', accessToken: '', isSignedIn: false })
        localStorage.setItem('token', '');
        localStorage.setItem('email', '');
        localStorage.setItem('username', '');
        document.getElementById("login-close").click();

    }

    render() {

        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

        return (
            <div className="user-login">
                {(this.state.isLoginMode) ?
                    <div className="login-container">
                        <div>
                            <h2> Login </h2>
                            <div> E-Mail/Username: </div>
                            <input type="text" id="username" className="input-box"></input>
                            <div> Password: </div>
                            <input type="password" id="password" className="input-box"></input>
                        </div>
                        <button className="button" name="login" onClick={this.handleOnClick.bind(this)}> Login</button>
                        <button className="button" name="back" onClick={this.handleOnClick.bind(this)}> Back</button>
                    </div> : (this.state.isRegisterMode) ?
                        <div className="register-container">
                            <div>
                                <h2> Register </h2>
                                <div> E-Mail: </div>
                                <input type="text" id="email" className="input-box"></input>
                                <div> Username: </div>
                                <input type="text" id="username" className="input-box"></input>
                                <div> Password: </div>
                                <input type="password" id="password" className="input-box"></input>
                                <div> Confirm Password: </div>
                                <input type="password" id="password2" className="input-box"></input>
                            </div>
                            <button className="button" name="register" onClick={this.handleOnClick.bind(this)}> Register</button>
                            <button className="button" name="back" onClick={this.handleOnClick.bind(this)}> Back</button>
                        </div> :
                        <div>
                            <button className="button" name="loginMode" onClick={this.handleOnClick.bind(this)}> Login</button>
                            <button className="button" name="registerMode" onClick={this.handleOnClick.bind(this)}> Register</button>
                            <button className="button" name="logoutrMode" onClick={this.handleOnClick.bind(this)}> Logout </button>
                        </div>
                }

            </div >
        );
    }
}

export default connect(null, mapDispatchToProps)(UserAuth);