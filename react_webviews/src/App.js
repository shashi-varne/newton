import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset,
  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { themeConfig } from 'utils/constants';
import { withRouter } from "react-router";
import { ToastContainer } from 'react-toastify';

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
import HelpSupport from './help_support_v2';
import CommonLanding from './common/components/landing';
// import CommonRenderFaqs from './common/components/RenderFaqs';

import Fhc from './fhc';
import WealthReport from './wealth_report';
import InternalWealthDashboard from './internal_wealth_dashboard';
import Loan from './loan';
import Payment from './payment';
import KycEsign from './kyc_esign';
import PortfolioRebalancing from './portfolio_rebalancing';
import FundDetails from './fund_details';
import Whatsapp from './whatsapp';
import FisdomPartnerRedirect from "./fisdom_partner_redirect"

import Tooltip from 'common/ui/Tooltip';
import 'common/theme/Style.scss';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

var basename = window.sessionStorage.getItem('base_href') || '';
if (basename && basename.indexOf('appl/webview') !== -1) {
  basename = basename ? basename + 'view/' : '';
}

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0)
      }
    }

    render() {
      return null;
    }
  }
);

class App extends Component {

  render() {
    return (
      <BrowserRouter basename={basename}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
          <ScrollToTop />
            <Tooltip />
            <ToastContainer autoClose={3000} />
            <Switch>
              <Route path='/insurance' component={Insurance} />
              <Route path='/group-insurance' component={GroupInsurance} />
              <Route path='/referral' component={Referral} />
              <Route path='/gold' component={Gold} />
              <Route path='/fhc' component={Fhc} />
              <Route path='/mandate' component={Mandate} />
              <Route path='/mandate-otm' component={Mandate_OTM} />
              <Route path='/e-mandate' component={EMandate} />
              <Route path='/risk' component={RiskProfiler} />
              <Route path='/hni/' component={HNI} />
              <Route path='/isip' component={IsipBIller} />
              <Route path='/w-report' component={WealthReport} />
              <Route path='/help' component={HelpSupport} />
              <Route path='/loan' component={Loan} />
              <Route path='/pg' component={Payment} />
              <Route path='/kyc-esign' component={KycEsign} />
              <Route path='/whatsapp/' component={Whatsapp} />
              <Route path="/iw-dashboard" component={InternalWealthDashboard} />
              <Route path='/webview/:main_module/:sub_module' component={CommonLanding} />
              <Route path='/webview/:main_module' component={CommonLanding} />
              {/* <Route path="/common/render-faqs" component={CommonRenderFaqs} /> */}
              <Route path='/portfolio-rebalancing' component={PortfolioRebalancing} />
              <Route path='/fund-details' component={FundDetails} />
              <Route path='/partner-landing' component={FisdomPartnerRedirect} />
              <Route component={NotFound} />
            </Switch>
          
          </MuiThemeProvider>
        </JssProvider>
      </BrowserRouter>
    );
  }
}

export default App;
