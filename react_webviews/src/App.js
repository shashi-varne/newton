import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Logout from './login_and_registration/pages/Login/Logout.js';
import FisdomPartnerRedirect from './fisdom_partner_redirect';
// import WealthReport from './wealth_report';


import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset,
  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { themeConfig } from 'utils/constants';
import { withRouter } from "react-router";
import { ToastContainer } from 'react-toastify';

// import InternalWealthDashboard from './internal_wealth_dashboard';
import DesktopLayout from './desktopLayout';
// import CommonRenderFaqs from './common/components/RenderFaqs';


import RmLogin from './RmJourney/login';
import Feature from './Feature';
import Tooltip from 'common/ui/Tooltip';
import ComponentTest from './ComponentTest';
import {getConfig, isDietProduct} from './utils/functions';
import 'common/theme/Style.scss';
import { storageService } from './utils/validators';
import LoginContainer from './login_and_registration/components/LoginContainer';
import PartnerAuthentication from './login_and_registration/pages/Authentication';
import Prepare from './dashboard/Invest/components/SdkLanding/Prepare';
import UnAuthenticatedRoute from './common/components/UnAuthenticatedRoute.js';
import RedirectToAnyPath from './common/components/RedirectToAnyPath.js';
import eventManager from './utils/eventManager.js';
import { EVENT_MANAGER_CONSTANTS } from './utils/constants.js';

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

var basename = window.localStorage.getItem('base_href') || '';
if (basename && basename.indexOf('appl/web') !== -1) {
  basename = basename ? basename + 'view/' : '';
}

const clearBottomsheetDisplays = () => {
  const bottomSheetsArr = [
    "is_bottom_sheet_displayed", 
    "verifyDetailsSheetDisplayed", 
    "is_bottom_sheet_displayed_kyc_premium", 
    "landingBottomSheetDisplayed",
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
  const iframe = config.isIframe;
  const isMobileDevice = config.isMobileDevice;
  const isDietEnabled = isDietProduct();
  const [themeConfiguration, setThemeConfiguration] = useState(getMuiThemeConfig());
  const isWithoutDesktopLayout = isMobileDevice || iframe || window.location.pathname.includes('pg/eq') || isDietEnabled;
  useEffect(() => {
    if(config.isSdk || config.isIframe) {
      storageService().set("entry_path",window.location.pathname);
    }
    clearBottomsheetDisplays();
    eventManager.add(EVENT_MANAGER_CONSTANTS.updateAppTheme, updateAppTheme);
    eventManager.add(EVENT_MANAGER_CONSTANTS.storePartnerCode, getConfig().code);
  }, []);

  const updateAppTheme = (event) => {
    const oldPartnerCode = eventManager.get(EVENT_MANAGER_CONSTANTS.storePartnerCode);
    const newPartnerCode = getConfig().code;
    if(newPartnerCode === oldPartnerCode) return;
    const theme = getMuiThemeConfig();
    setThemeConfiguration(theme);
    eventManager.add(EVENT_MANAGER_CONSTANTS.storePartnerCode, newPartnerCode);
  }

    return (
      <BrowserRouter basename={basename}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={themeConfiguration}>
            <ScrollToTop />
            <Tooltip />
            <ToastContainer autoClose={3000} />
            <RedirectToAnyPath />
            <Switch>
              {/* Not working */}
              {/* <Route path="/iw-dashboard" component={InternalWealthDashboard} /> */}
              {/* <Route path='/w-report' component={WealthReport} /> */}
               {/* Not working */}
              {/* Working category*/}
              <Route path='/partner-landing' component={FisdomPartnerRedirect} />
              <Route path='/component-test' component={ComponentTest} />
              <Route path='/logout' component={Logout} />
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
              {
                isWithoutDesktopLayout ?
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
