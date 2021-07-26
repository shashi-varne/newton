import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Logout from './login_and_registration/pages/Login/Logout.js';
import FisdomPartnerRedirect from './fisdom_partner_redirect';
import WealthReport from './wealth_report';


import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset,
  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { themeConfig } from 'utils/constants';
import { withRouter } from "react-router";
import { ToastContainer } from 'react-toastify';

import InternalWealthDashboard from './internal_wealth_dashboard';
import DesktopLayout from './desktopLayout';
// import CommonRenderFaqs from './common/components/RenderFaqs';


import Feature from './Feature';
import Tooltip from 'common/ui/Tooltip';
import {getConfig} from './utils/functions';
import ComponentTest from './ComponentTest';
import 'common/theme/Style.scss';
import { storageService } from './utils/validators';
import LoginContainer from './login_and_registration/components/LoginContainer';

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
const isMobileDevice = getConfig().isMobileDevice;

const isBottomSheetDisplayed = storageService().get('is_bottom_sheet_displayed');
if(isBottomSheetDisplayed) {
  storageService().set("is_bottom_sheet_displayed", false);
}

const verifyDetailsSheetDisplayed = storageService().get('verifyDetailsSheetDisplayed');
if(verifyDetailsSheetDisplayed)
  storageService().set("verifyDetailsSheetDisplayed", false)
  
const isBottomSheetDisplayedKycPremium = storageService().get(
  "is_bottom_sheet_displayed_kyc_premium"
);

if(isBottomSheetDisplayedKycPremium) {
  storageService().set("is_bottom_sheet_displayed_kyc_premium", false);
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

const App = () => {
  
    return (
      <BrowserRouter basename={basename}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
          <ScrollToTop />
            <Tooltip />
            <ToastContainer autoClose={3000} />
            <Switch>
              <Route path="/iw-dashboard" component={InternalWealthDashboard} />
              <Route path='/w-report' component={WealthReport} />
              <Route
                path={[
                  '/login',
                  '/forgot-pin'
                ]}
                component={LoginContainer}
              />
              <Route path='/partner-landing' component={FisdomPartnerRedirect} />
              <Route path='/logout' component={Logout} />
              <Route path='/component-test' component={ComponentTest} />
              {
                isMobileDevice ?
                <Route component={Feature}/>:
                <DesktopLayout>
                  <Feature />
                </DesktopLayout>
              }
            </Switch>
          </MuiThemeProvider>
        </JssProvider>
      </BrowserRouter>
    );
}

export default App;
