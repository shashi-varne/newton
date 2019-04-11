import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import NotFound from './common/components/NotFound';
import Insurance from './insurance';
import Referral from './referral';
import Gold from './gold';
import Mandate from './mandate_address';
import Mandate_OTM from './mandate_otm';
import RiskProfiler from './risk_profiler';
import IsipBIller from './isip';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/insurance" component={Insurance} />
          <Route path="/referral" component={Referral} />
          <Route path="/gold" component={Gold} />
          <Route path="/mandate" component={Mandate} />
          <Route path="/mandate-otm" component={Mandate_OTM} />
          <Route path="/risk" component={RiskProfiler} />
          <Route path="/isip" component={IsipBIller} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
