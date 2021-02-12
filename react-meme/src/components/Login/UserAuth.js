const React = require('react');

class UserAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state =
        {
            isLoginMode: false,
            isRegisterMode: false,
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
                body: {username: username, password: password }
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

    render() {
        return (
            <div className="user-login">
                {(this.state.isLoginMode) ?
                    <div className="login-container">
                        <div>
                            <h2> Login </h2>
                            <div> E-Mail/Username: </div>
                            <input type="text" id="username" class="input-box"></input>
                            <div> Password: </div>
                            <input type="password" id="password" class="input-box"></input>
                        </div>
                        <a className="button" name="login" onClick={this.handleOnClick.bind(this)}> Login</a>
                        <a className="button" name="back" onClick={this.handleOnClick.bind(this)}> Back</a>
                    </div> : (this.state.isRegisterMode) ?
                        <div className="register-container">
                            <div>
                                <h2> Register </h2>
                                <div> E-Mail: </div>
                                <input type="text" id="email" class="input-box"></input>
                                <div> Username: </div>
                                <input type="text" id="username" class="input-box"></input>
                                <div> Password: </div>
                                <input type="password" id="password" class="input-box"></input>
                                <div> Confirm Password: </div>
                                <input type="password" id="password2" class="input-box"></input>
                            </div>
                            <a className="button" name="register" onClick={this.handleOnClick.bind(this)}> Register</a>
                            <a className="button" name="back" onClick={this.handleOnClick.bind(this)}> Back</a>
                        </div> :
                        <div>
                            <a className="button" name="loginMode" onClick={this.handleOnClick.bind(this)}> Login</a>
                            <a className="button" name="registerMode" onClick={this.handleOnClick.bind(this)}> Register</a>
                        </div>
                }

            </div >
        );
    }
}

export default UserAuth;