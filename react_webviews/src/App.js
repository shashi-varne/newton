import "common/theme/Style.scss";
import React, { Component, useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import JssProvider from "react-jss/lib/JssProvider";
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { create } from "jss";
import { themeConfig } from "utils/constants";
import { getConfig, isDietProduct } from "./utils/functions";
import { storageService } from "./utils/validators";
import { ToastContainer } from "react-toastify";
import DesktopLayout from "./desktopLayout";
import ErrorBoundary from "./ErrorBoundary";
import BootSkeleton from "./common/components/BootSkeleton";
import UnAuthenticatedRoute from "./common/components/UnAuthenticatedRoute.js";
import RedirectToAnyPath from "./common/components/RedirectToAnyPath.js";
import eventManager from "./utils/eventManager.js";
import { EVENT_MANAGER_CONSTANTS } from "./utils/constants.js";
import { Provider } from "react-redux";
import store, { persistor } from "./dataLayer/store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import LoginContainer from "./login_and_registration/components/LoginContainer";
import Logout from "./login_and_registration/pages/Logout/Logout";
import AppInitialization from "./common/components/AppInitialization";
import { nativeCallback } from "./utils/native_callback";

const Prepare = lazy(() =>
  import(
    /*webpackChunkName: "Prepare"*/ "./dashboard/Invest/components/SdkLanding/Prepare"
  )
);
const Tooltip = lazy(() =>
  import(/*webpackChunkName: "Tooltip"*/ "common/ui/Tooltip")
);
const NotFound = lazy(() =>
  import(/*webpackChunkName: "NotFound"*/ "./common/components/NotFound")
);
const FisdomPartnerRedirect = lazy(() =>
  import(
    /* webpackChunkName: "FisdomPartnerRedirect" */ "./fisdom_partner_redirect"
  )
);
const PartnerAuthentication = lazy(() =>
  import(
    /* webpackChunkName: "Authentication" */ "./login_and_registration/pages/Authentication"
  )
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

var basename = window.localStorage.getItem("base_href") || "";
if (basename && basename.indexOf("appl/web") !== -1) {
  basename = basename ? basename + "view/" : "";
}

const clearBottomsheetDisplays = () => {
  const bottomSheetsArr = [
    "isCampaignDialogDisplayed",
    "verifyDetailsSheetDisplayed",
    "isKycPremiumBottomSheetDisplayed",
    "landingBottomSheetDisplayed",
  ];

  bottomSheetsArr.forEach((bottomSheet) => {
    storageService().remove(bottomSheet);
  });
};

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
  const iframe = config.isIframe;
  const isMobileDevice = config.isMobileDevice;
  const isDietEnabled = isDietProduct();
  const [themeConfiguration, setThemeConfiguration] = useState(
    getMuiThemeConfig()
  );
  const isWithoutDesktopLayout =
    isMobileDevice ||
    iframe ||
    window.location.pathname.includes("pg/eq") ||
    isDietEnabled;
  useEffect(() => {
    initializeSdkData();
    if (config.isSdk || config.isIframe) {
      storageService().set("entry_path", window.location.pathname);
    }
    clearBottomsheetDisplays();
    eventManager.add(EVENT_MANAGER_CONSTANTS.updateAppTheme, updateAppTheme);
    eventManager.add(
      EVENT_MANAGER_CONSTANTS.storePartnerCode,
      getConfig().code
    );
  }, []);


  const initializeSdkData = () => {
    if (config.isSdk && config.Android) {
      nativeCallback({ action: "get_data" });
    }
  };

  const updateAppTheme = (event) => {
    const oldPartnerCode = eventManager.get(
      EVENT_MANAGER_CONSTANTS.storePartnerCode
    );
    const newPartnerCode = getConfig().code;
    if (newPartnerCode === oldPartnerCode) return;
    const theme = getMuiThemeConfig();
    setThemeConfiguration(theme);
    eventManager.add(EVENT_MANAGER_CONSTANTS.storePartnerCode, newPartnerCode);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={basename}>
          <JssProvider jss={jss} generateClassName={generateClassName}>
            <MuiThemeProvider theme={themeConfiguration}>
              <ScrollToTop />
              <ToastContainer autoClose={3000} />
              <ErrorBoundary>
                <Suspense fallback={<BootSkeleton />}>
                  <Tooltip />
                  <AppInitialization />
                  <RedirectToAnyPath />
                  <Switch>
                    {/* <Route
                      path="/iw-dashboard"
                      component={InternalWealthDashboard}
                    />
                    <Route
                      path="/w-report"
                      component={WealthReport}
                    /> */}
                    <UnAuthenticatedRoute
                      path={["/login", "/forgot-pin"]}
                      component={LoginContainer}
                    />
                    <Route path="/rm-login" component={RmLogin} />
                    <Route
                      path="/partner-landing"
                      component={FisdomPartnerRedirect}
                    />
                    <Route
                      path="/partner-authentication/:partnerCode"
                      component={PartnerAuthentication}
                    />
                    <Route path="/logout" component={Logout} />
                    <Route path="/prepare" component={Prepare} />
                    {isWithoutDesktopLayout ? (
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
          </JssProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
