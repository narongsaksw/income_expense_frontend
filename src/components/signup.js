import React, { Component } from "react";
import axios from 'axios'

const api = 'http://localhost:8080'
export default class SignUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            username: '',
            password: ''
        }
    }
    
    onFirstnameChange = e => {
        this.setState({ firstname: e.target.value})
    }

    onLastnameChange = e => {
        this.setState({ lastname: e.target.value})
    }

    onUsernameChange = e => {
        this.setState({ username: e.target.value})
    }

    onPasswordChange = e => {
        this.setState({ password: e.target.value})
    }

    SignUp = e => {
        e.preventDefault();
        const { firstname, lastname, username, password } = this.state
        if(firstname === ''){
            alert('Enter Firstname please')
        }
        else if(lastname === ''){
            alert('Enter Lastname please')
        }
        else if(username === ''){
            alert('Enter Username please')
        }
        else if(password === ''){
            alert('Enter Password please')
        }
        else{
            let data = {
                firstname : firstname,
                lastname : lastname,
                username : username,
                password : password
            }
        axios.post(`${api}/users`, data)
        .then(res => {
            alert('Sign Up Success')
            return res
        })
        .then( window.location.reload() )
        }
    }

    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.SignUp}>
                        <h3>Sign Up</h3>

                        <div className="form-group">
                            <label>First name</label>
                            <input 
                                type="text" 
                                pattern="^[ก-๏a-zA-Z\s]+$" 
                                title='Characters Only'
                                className="form-control" 
                                placeholder="First name"
                                onChange={this.onFirstnameChange}
                                />
                        </div>

                        <div className="form-group">
                            <label>Last name</label>
                            <input 
                                type="text" 
                                pattern="^[ก-๏a-zA-Z\s]+$" 
                                title='Characters Only'
                                className="form-control" 
                                placeholder="Last name"
                                onChange={this.onLastnameChange}
                                />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                pattern="^[a-zA-Z0-9\s]+$" 
                                className="form-control" 
                                placeholder="Enter Username"
                                onChange={this.onUsernameChange}
                                />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                pattern="^[a-zA-Z0-9\s]+$"
                                title='more 6 Characters'
                                minLength={6} 
                                className="form-control" 
                                placeholder="Enter password"
                                onChange={this.onPasswordChange}
                                />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block"
                            >Sign Up
                        </button>

                        <p className="forgot-password text-right">
                            Already registered 
                            <a href="/sign-in">sign in?</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
