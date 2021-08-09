import React from 'react';

import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { PrivateRoute } from './helpers/PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact component={Login} path="/login" />
          <Route exact component={Signup} path="/signup" />
          <PrivateRoute exact component={Dashboard} path="/" />

          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
