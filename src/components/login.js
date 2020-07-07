import React, { Component } from "react";
import axios from 'axios'

const api = 'http://localhost:8080'

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            username: '',
            password: ''
        }
    }
    onUsernameChange = e => {
        this.setState({ username: e.target.value });
    }    
    onPasswordChange = e => {
        this.setState({ password: e.target.value });
    }    
    SubmitLogin = e => {
        e.preventDefault();
        let data = {
            username: this.state.username,
            password: this.state.password
        }
        axios.post(`${api}/users/login`, data)
        .then(res => {
            if(res.data.token){
                localStorage.setItem("user",JSON.stringify(res.data.token));
            }
            return res.data
        })
    }
    render() {
        const { username, password } = this.state
        return (
            <form>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        id="username_text" 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Username" 
                        onChange={this.onUsernameChange}
                        value={username}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        id="password" 
                        type="password" 
                        minLength={6} 
                        className="form-control" 
                        placeholder="Enter password" 
                        onChange={this.onPasswordChange}
                        value={password} />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    onClick={this.SubmitLogin}
                >Submit
                </button>
            </form>
        );
    }
}