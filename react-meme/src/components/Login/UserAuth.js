const React = require('react');

class UserAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state =
        {
            isLoginMode: false,
            isRegisterMode: false,
        }

    }

    handleOnClick(event) {
        if (event.target.name === 'login') {
            this.setState({
                isRegisterMode: false,
                isLoginMode: true,
            })
        } else if (event.target.name === 'register') {
            this.setState({
                isRegisterMode: true,
                isLoginMode: false,
            })
        } else {
            this.setState({
                isRegisterMode: false,
                isLoginMode: false,
            })
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
                        <input type="text" class="input-box"></input>
                        <div> Password: </div>
                        <input type="password" class="input-box"></input>
                        </div>
                        <a className="button" name="login" onClick={this.handleOnClick.bind(this)}> Login</a>
                        <a className="button" name="back" onClick={this.handleOnClick.bind(this)}> Back</a>
                    </div> : (this.state.isRegisterMode) ?
                        <div className="register-container">
                            <div>
                                <h2> Register </h2>
                                <div> E-Mail: </div>
                                <input type="text" class="input-box"></input>
                                <div> Username: </div>
                                <input type="text" class="input-box"></input>
                                <div> Password: </div>
                                <input type="password" class="input-box"></input>
                                <div> Confirm Password: </div>
                                <input type="password" class="input-box"></input>
                            </div>
                            <a className="button" name="register" onClick={this.handleOnClick.bind(this)}> Register</a>
                            <a className="button" name="back" onClick={this.handleOnClick.bind(this)}> Back</a>
                        </div> :
                        <div>
                            <a className="button" name="login" onClick={this.handleOnClick.bind(this)}> Login</a>
                            <a className="button" name="register" onClick={this.handleOnClick.bind(this)}> Register</a>
                        </div>
                }

            </div >
        );
    }
}

export default UserAuth;