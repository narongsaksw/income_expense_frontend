import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import { Table } from 'antd'

import authHeader from '../services/auth-header';

const api = 'http://localhost:8080'

export default class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      income: 0,
      expense: 0,
      message: '',
      loading: false,
      select_type: [{'value':'Income'}, {'value':'Expense'}],
      type_value: ''
    };
  }

  componentDidMount() {
    axios.get(`${api}/users`, { headers: authHeader() })
    .then(res => {
        this.setState({
            user: res.data
        })
    })
  }

  logOut = () => {
    localStorage.removeItem('user');
  }

  onIncomeChange = e => {
    this.setState({ income: e.target.value })
  }

  onExpenseChange = e => {
    this.setState({ expense: e.target.value })
  }

  onTypeChange = (value) => {
    console.log(value);
    
     this.setState({ type_value: value})  
  }

  onSubmit = e => {
    e.preventDefault();
  }

  render() {
    const { income } = this.state
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

          <div className="auth-wrapper">
            <div className="col-4">
              <div className="auth-inner">
                <form onSubmit={this.onSubmit}>
                  <h3>Form</h3>
                  <div className="form-group">
                    <label>Amount</label>
                      <input 
                        id="income_value" 
                        type="text" 
                        className="form-control" 
                        onChange={this.onIncomeChange}
                        value={income}/>
                  </div>
                  <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text">Type</label>
                      <select
                        className="custom-select" 
                        id="inputGroupSelect01"
                      >
                        <option value='Income'>Income</option>
                        <option value='Expense'>Expense</option>
                      </select>
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

          <div className="auth-wrapper">            
            <div className="col-7">
              <div className="auth-inner">
                <Table
                  rowKey='columns'
                  // columns={columns}
                />
              </div>
            </div>
          </div>
      </div>
    );
  }
}
