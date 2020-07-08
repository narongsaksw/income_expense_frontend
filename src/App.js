import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/signup";
import AdminPage from "./components/adminPage";
import UserPage from "./components/userPage";

class App extends Component {
  render() {
    return (
      <Router>
              <Switch>
                <Route exact path='/' component={Login} />
                <Route path="/sign-in" component={Login} />
                <Route path="/sign-up" component={SignUp} />
                <Route path="/user" component={UserPage} />
                <Route path="/admin" component={AdminPage} />
              </Switch>  
      </Router>
    );
  } 
}

export default App;