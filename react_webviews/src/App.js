import React, { Component, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './login_and_registration/Login';
import Register from './login_and_registration/Register';
import Otp from './login_and_registration/Otp';
import ForgotPassword from './login_and_registration/ForgotPassword';
import Logout from './login_and_registration/Logout';
import FisdomPartnerRedirect from './fisdom_partner_redirect';
import WealthReport from './wealth_report';
import SocialCallback from './login_and_registration/SocialCallback';


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

import NotFound from './common/components/NotFound';
import Tooltip from 'common/ui/Tooltip';
import {getConfig, isIframe} from './utils/functions';
import 'common/theme/Style.scss';
import { storageService } from './utils/validators';
import PartnerAuthentication from './login_and_registration/Authentication';
import Prepare from './dashboard/Invest/components/SdkLanding/Prepare';
import { ThemeProvider } from './utils/ThemeContext';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const getMuiThemeConfig = () => { 
  return createMuiTheme(themeConfig());
}

var basename = window.sessionStorage.getItem('base_href') || '';
if (basename && basename.indexOf('appl/webview') !== -1) {
  basename = basename ? basename + 'view/' : '';
}
const isMobileDevice = getConfig().isMobileDevice;

const isBottomSheetDisplayed = storageService().get('is_bottom_sheet_displayed');
if(isBottomSheetDisplayed) {
  storageService().set("is_bottom_sheet_displayed", false);
}

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
  const [themeConfiguration, setThemeConfiguration] = useState(getMuiThemeConfig());

  const updateTheme = (event) => {
    const theme = getMuiThemeConfig();
    setThemeConfiguration(theme)
  }
  const iframe = isIframe();
    return (
      <BrowserRouter basename={basename}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <ThemeProvider value={{updateTheme}}>
          <MuiThemeProvider theme={themeConfiguration}>
            <ScrollToTop />
            <Tooltip />
            <ToastContainer autoClose={3000} />
            <Switch>
              <Route path="/iw-dashboard" component={InternalWealthDashboard} />
              <Route path='/w-report' component={WealthReport} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/mobile/verify' component={Otp} />
              <Route path='/forgot-password' component={ForgotPassword} />
              <Route path='/social/callback' component={SocialCallback} />
              <Route path='/partner-landing' component={FisdomPartnerRedirect} />
              <Route path="/partner-authentication/:partnerCode" component={PartnerAuthentication} />
              <Route path='/logout' component={Logout} />
              <Route path="/prepare" component={Prepare} />
              {
                isMobileDevice || iframe ?
                <Route component={Feature}/>:
                <DesktopLayout>
                  <Feature />
                </DesktopLayout>
              }
              <Route component={NotFound} />
            </Switch>
          </MuiThemeProvider>
          </ThemeProvider>
        </JssProvider>
      </BrowserRouter>
    );
}

export default App;
