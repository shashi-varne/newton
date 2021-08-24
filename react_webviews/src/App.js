import React, { Component, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { themeConfig } from "utils/constants";
import { withRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import Loadable from "react-loadable";

import DesktopLayout from "./desktopLayout";
// import CommonRenderFaqs from './common/components/RenderFaqs';

import NotFound from "./common/components/NotFound";
import Tooltip from "common/ui/Tooltip";
import { getConfig } from "./utils/functions";
import "common/theme/Style.scss";
import { storageService } from "./utils/validators";
import Prepare from "./dashboard/Invest/components/SdkLanding/Prepare";
import { ThemeProvider } from "./utils/ThemeContext";

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

var basename = window.sessionStorage.getItem("base_href") || "";
if (basename && basename.indexOf("appl/webview") !== -1) {
  basename = basename ? basename + "view/" : "";
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

const InternalWealthDashboardComponent = Loadable({
  loader: () =>
    import(
      /*webpackChunkName: "internal_wealth_dashboard"*/ "./internal_wealth_dashboard"
    ),
  loading: () => <div>Loading...</div>,
});
const LoginComponent = Loadable({
  loader: () =>
    import(/*webpackChunkName: "Login"*/ "./login_and_registration/Login"),
  loading: () => <div>Loading...</div>,
});
const RegistrationComponent = Loadable({
  loader: () =>
    import(
      /*webpackChunkName: "Registration"*/ "./login_and_registration/Register"
    ),
  loading: () => <div>Loading...</div>,
});
const OtpComponent = Loadable({
  loader: () =>
    import(/*webpackChunkName: "Otp"*/ "./login_and_registration/Otp"),
  loading: () => <div>Loading...</div>,
});
const ForgotPasswordComponent = Loadable({
  loader: () =>
    import(
      /*webpackChunkName: "ForgotPassword"*/ "./login_and_registration/ForgotPassword"
    ),
  loading: () => <div>Loading...</div>,
});
const WealthReportComponent = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Wealth_Report" */ "./wealth_report"),
  loading: () => <div>Loading...</div>,
});
const SocialCallbackComponent = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "Social_Callback" */ "./login_and_registration/SocialCallback"
    ),
  loading: () => <div>Loading...</div>,
});
const FisdomPartnerRedirectComponent = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "FisdomPartnerRedirect" */ "./fisdom_partner_redirect"
    ),
  loading: () => <div>Loading...</div>,
});

const PartnerAuthenticationComponent = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "Authentication" */ "./login_and_registration/Authentication"
    ),
  loading: () => <div>Loading...</div>,
});
const FeatureComponent = Loadable({
  loader: () => import(/* webpackChunkName: "Feature" */ "./Feature"),
  loading: () => <div>Loading...</div>,
});
const LogoutComponent = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Logout" */ "./login_and_registration/Logout"),
  loading: () => <div>Loading...</div>,
});
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
            <Tooltip />
            <ToastContainer autoClose={3000} />
            <Switch>
              <Route
                path="/iw-dashboard"
                component={InternalWealthDashboardComponent}
              />
              <Route path="/w-report" component={WealthReportComponent} />
              <Route path="/login" component={LoginComponent} />
              <Route path="/register" component={RegistrationComponent} />
              <Route path="/mobile/verify" component={OtpComponent} />
              <Route
                path="/forgot-password"
                component={ForgotPasswordComponent}
              />
              <Route
                path="/social/callback"
                component={SocialCallbackComponent}
              />
              <Route
                path="/partner-landing"
                component={FisdomPartnerRedirectComponent}
              />
              <Route
                path="/partner-authentication/:partnerCode"
                component={PartnerAuthenticationComponent}
              />
              <Route path="/logout" component={LogoutComponent} />
              <Route path="/prepare" component={Prepare} />
              {isMobileDevice || iframe ? (
                <Route component={FeatureComponent} />
              ) : (
                <DesktopLayout>
                  <FeatureComponent />
                </DesktopLayout>
              )}
              <Route component={NotFound} />
            </Switch>
          </MuiThemeProvider>
        </ThemeProvider>
      </JssProvider>
    </BrowserRouter>
  );
};

export default App;
