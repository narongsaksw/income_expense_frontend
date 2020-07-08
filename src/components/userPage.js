import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import authHeader from '../services/auth-header';
const api = 'http://localhost:8080'

export default class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      user_data: []
    };
  }

  componentDidMount() {
    axios.get(`${api}/users`, { headers: authHeader() })
    .then(res => {
        this.setState({
            user_data: res.data
        })
        // console.log(this.state.user_data);
        
    })

  }

  render() {
    return (
      <div className='App'>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
              <div className="container">
                <Link className="navbar-brand" to={"/sign-in"}>Income & Expense</Link>
                  <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ml-auto">
                      <li className="nav-item">
                        <Link className="nav-link" to={"/sign-in"} onClick={this.logOut}>LogOut</Link>
                      </li>
                    </ul>
                  </div>
              </div>
            </nav>
            <div className="container">
              <p>Hello User Page</p>
            </div>
      </div>
    );
  }
}
