import React, { Component, useState, useEffect } from 'react';
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


import RmLogin from './RmJourney/login';
import Feature from './Feature';
import Tooltip from 'common/ui/Tooltip';
import ComponentTest from './ComponentTest';
import {getConfig} from './utils/functions';
import 'common/theme/Style.scss';
import { storageService } from './utils/validators';
import LoginContainer from './login_and_registration/components/LoginContainer';
import PartnerAuthentication from './login_and_registration/pages/Authentication';
import Prepare from './dashboard/Invest/components/SdkLanding/Prepare';
import { ThemeProvider } from './utils/ThemeContext';
import UnAuthenticatedRoute from './common/components/UnAuthenticatedRoute.js';

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
if (basename && basename.indexOf('appl/web') !== -1) {
  basename = basename ? basename + 'view/' : '';
}

const clearBottomsheetDisplays = () => {
  const bottomSheetsArr = [
    "is_bottom_sheet_displayed", 
    "verifyDetailsSheetDisplayed", 
    "is_bottom_sheet_displayed_kyc_premium", 
    "landingBottomSheetDisplayed"
  ];

  bottomSheetsArr.forEach((bottomSheet) => {
    storageService().remove(bottomSheet);
  });
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
  const config = getConfig();
  const isMobileDevice = config.isMobileDevice;
  const [themeConfiguration, setThemeConfiguration] = useState(getMuiThemeConfig());
  useEffect(() => {
    if(config.isSdk || config.isIframe) {
      storageService().set("entry_path",window.location.pathname);
    }
    clearBottomsheetDisplays();
  },[]);
  const updateTheme = (event) => {
    const theme = getMuiThemeConfig();
    setThemeConfiguration(theme)
  }
  const iframe = config.isIframe;
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
              <UnAuthenticatedRoute
                path={[
                  '/login',
                  '/forgot-pin'
                ]}
                component={LoginContainer}
              />
              <UnAuthenticatedRoute path='/rm-login' component={RmLogin} />
              <UnAuthenticatedRoute path="/partner-authentication/:partnerCode" component={PartnerAuthentication} />
              <UnAuthenticatedRoute path="/prepare" component={Prepare} />
              <Route path='/partner-landing' component={FisdomPartnerRedirect} />
              <Route path='/logout' component={Logout} />
              <Route path='/component-test' component={ComponentTest} />
              {
                isMobileDevice || iframe ?
                <Route component={Feature}/>:
                <DesktopLayout>
                  <Feature />
                </DesktopLayout>
              }
            </Switch>
          </MuiThemeProvider>
          </ThemeProvider>
        </JssProvider>
      </BrowserRouter>
    );
}

export default App;
