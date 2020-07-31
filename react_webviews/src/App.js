import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import NotFound from './common/components/NotFound';
import Insurance from './insurance';
import GroupInsurance from './group_insurance';
import Referral from './referral';
import Gold from './gold';
import Mandate from './mandate_address';
import Mandate_OTM from './mandate_otm';
import EMandate from './e_mandate';
import RiskProfiler from './risk_profiler';
import HNI from './external_portfolio';
import IsipBIller from './isip';
import HelpSupport from './help_support';
import CommonLanding from './common/components/landing';
import Fhc from './fhc';
import WealthReport from './wealth_report';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/insurance" component={Insurance} />
          <Route path="/group-insurance" component={GroupInsurance} />
          <Route path="/referral" component={Referral} />
          <Route path="/gold" component={Gold} />
          <Route path="/fhc" component={Fhc} />
          <Route path="/mandate" component={Mandate} />
          <Route path="/mandate-otm" component={Mandate_OTM} />
          <Route path="/e-mandate" component={EMandate} />
          <Route path="/risk" component={RiskProfiler} />
          <Route path="/hni/" component={HNI} />
          <Route path="/isip" component={IsipBIller} />
          <Route path="/wealth-report" component={WealthReport} />
          <Route path="/help" component={HelpSupport} />
          <Route path="/webview/:main_module/:sub_module" component={CommonLanding} />
          <Route path="/webview/:main_module" component={CommonLanding} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
