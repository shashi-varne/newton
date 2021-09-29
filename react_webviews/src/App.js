import React, { Component, useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import JssProvider from "react-jss/lib/JssProvider";
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { create } from "jss";
import { withRouter } from "react-router";
import "common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { getConfig } from "./utils/functions";
import { storageService } from "./utils/validators";
import { ThemeProvider } from "./utils/ThemeContext";
import { ToastContainer } from "react-toastify";
import DesktopLayout from "./desktopLayout";
import ErrorBoundary from "./ErrorBoundary";
import BootSkeleton from "./common/components/BootSkeleton";

const Prepare = lazy(() => import(
  /*webpackChunkName: "Prepare"*/ "./dashboard/Invest/components/SdkLanding/Prepare"
));
const Tooltip = lazy(() => import(
  /*webpackChunkName: "Tooltip"*/ "common/ui/Tooltip"
));
const NotFound = lazy(() => import(
  /*webpackChunkName: "NotFound"*/ "./common/components/NotFound"
));
const InternalWealthDashboard = lazy(() => import(
  /*webpackChunkName: "InternalWealthDashboard"*/ "./internal_wealth_dashboard"
));
const Login = lazy(() => import(
  /*webpackChunkName: "Login"*/ "./login_and_registration/Login"
));
const Registration = lazy(() => import(
  /*webpackChunkName: "Registration"*/ "./login_and_registration/Register")
);
const Otp = lazy(() => import(
  /*webpackChunkName: "Otp"*/ "./login_and_registration/Otp")
);
const ForgotPassword = lazy(() => import(
  /*webpackChunkName: "ForgotPassword"*/ "./login_and_registration/ForgotPassword")
);
const WealthReport = lazy(() => import(
  /* webpackChunkName: "WealthReport" */ "./wealth_report")
);
const SocialCallback = lazy(() => import(
  /* webpackChunkName: "SocialCallback" */ "./login_and_registration/SocialCallback")
);
const FisdomPartnerRedirect = lazy(() => import(
  /* webpackChunkName: "FisdomPartnerRedirect" */ "./fisdom_partner_redirect")
);
const PartnerAuthentication = lazy(() => import(
  /* webpackChunkName: "Authentication" */ "./login_and_registration/Authentication")
);
const Logout = lazy(() =>
  import(/* webpackChunkName: "Logout" */ "./login_and_registration/Logout")
);
const Feature = lazy(() =>
  import(/* webpackChunkName: "Feature" */ "./Feature")
);
const RmLogin = lazy(() =>
  import(/* webpackChunkName: "Feature" */ "./RmJourney/login")
);

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f",
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const getMuiThemeConfig = () => {
  return createMuiTheme(themeConfig());
};

var basename = window.sessionStorage.getItem('base_href') || '';
if (basename && basename.indexOf('appl/web') !== -1) {
  basename = basename ? basename + 'view/' : '';
}

const isBottomSheetDisplayed = storageService().get(
  "is_bottom_sheet_displayed"
);
if (isBottomSheetDisplayed) {
  storageService().set("is_bottom_sheet_displayed", false);
}

const isBottomSheetDisplayedKycPremium = storageService().get(
  "is_bottom_sheet_displayed_kyc_premium"
);

if (isBottomSheetDisplayedKycPremium) {
  storageService().set("is_bottom_sheet_displayed_kyc_premium", false);
}

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
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
  const [themeConfiguration, setThemeConfiguration] = useState(
    getMuiThemeConfig()
  );
  useEffect(() => {
    if (config.isSdk || config.isIframe) {
      storageService().set("entry_path", window.location.pathname);
    }
  }, []);
  const updateTheme = (event) => {
    const theme = getMuiThemeConfig();
    setThemeConfiguration(theme);
  };
  const iframe = config.isIframe;
  return (
    <BrowserRouter basename={basename}>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeProvider value={{ updateTheme }}>
          <MuiThemeProvider theme={themeConfiguration}>
            <ScrollToTop />
            <ToastContainer autoClose={3000} />
            <ErrorBoundary>
              <Suspense fallback={<BootSkeleton />}>
                <Tooltip />
                <Switch>
                  <Route
                    path="/iw-dashboard"
                    component={InternalWealthDashboard}
                  />
                  <Route
                    path="/w-report"
                    component={WealthReport}
                  />
                  <Route
                    path="/login"
                    component={Login}
                  />
                  <Route
                    path="/rm-login"
                    component={RmLogin}
                  />
                  <Route
                    path="/register"
                    component={Registration}
                  />
                  <Route
                    path="/mobile/verify"
                    component={Otp}
                  />
                  <Route
                    path="/forgot-password"
                    component={ForgotPassword}
                  />
                  <Route
                    path="/social/callback"
                    component={SocialCallback}
                  />
                  <Route
                    path="/partner-landing"
                    component={FisdomPartnerRedirect}
                  />
                  <Route
                    path="/partner-authentication/:partnerCode"
                    component={PartnerAuthentication}
                  />
                  <Route
                    path="/logout"
                    component={Logout}
                  />
                  <Route
                    path="/prepare"
                    component={Prepare}
                  />
                  {isMobileDevice || iframe ? (
                    <Route component={Feature} />
                  ) : (
                    <DesktopLayout>
                      <Feature />
                    </DesktopLayout>
                  )}
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </MuiThemeProvider>
        </ThemeProvider>
      </JssProvider>
    </BrowserRouter>
  );
};

export default App;
