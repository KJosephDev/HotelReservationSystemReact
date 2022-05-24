import React from 'react';
import {BrowserRouter, Route, Redirect, Link} from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import './styles.css';
import './app.css';





const App = () => (
  <div className="div-reservations" id="reservations">
    <h1>Hotel reservation System</h1>
    <BrowserRouter>
      <React.Fragment>
        <div>
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          <Route path="/dashboard" render={props => <Dashboard />} />
        </div>
      </React.Fragment>
    </BrowserRouter>

  </div>
);

export default App;
