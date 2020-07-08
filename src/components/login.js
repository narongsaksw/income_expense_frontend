import React, { Component } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
const api = 'http://localhost:8080'

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
            message: ""
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
        this.setState({
            message: "",
            loading: true
        });
        const { username, password } = this.state
        if(username !== '' && password !== ''){
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
            .then(() => {
                const decode_token = jwt_decode(JSON.parse(localStorage.getItem('user')))
                    if(decode_token && decode_token.user.role === 'admin'){
                        this.props.history.push('/admin');
                    }
                    else if(decode_token && decode_token.user.role === 'user'){
                        this.props.history.push('/user');
                    }
                    else{
                        this.props.history.push('/sign-in');
                        localStorage.removeItem('user')
                    }
            },
            () => {
              this.setState({
                loading: false,
                message: 'Username or Password Invalid'
              });
            })
        }
        else{
            this.setState({ loading: false });
        }
    }
    render() {
        const { username, password } = this.state
        return (
        <div className='App'>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <Link className="navbar-brand" to={"/sign-in"}>Income & Expense</Link>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/sign-in"}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.SubmitLogin}>
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
                            disabled={this.state.loading}
                        >
                            {this.state.loading && (
                                <span className="spinner-border spinner-border-sm" style={{marginRight:10}}></span>
                            )}
                            <span>Submit</span>
                        </button>

                        {this.state.message && (
                            <div className="form-group">
                                <div className="alert alert-danger" style={{marginTop:15}} role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
        );
    }
}