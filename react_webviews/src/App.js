import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import NotFound from './NotFound';
import Insurance from './insurance';
import Referral from './referral';
import Gold from './gold';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/insurance" component={Insurance} />
          <Route path="/referral" component={Referral} />
          <Route path="/gold" component={Gold} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
