import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.scss";
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";


import Landing from "./components/general/landing";
import MobileVerify from "./components/general/mobile_verify";
import OtpVerification from "./components/general/otp_verify";

import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f"
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

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

const Lending = props => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>

          <Route path={`${url}/home`} component={Landing} />
          <Route path={`${url}/edit-number`} component={MobileVerify} />
          <Route path={`${url}/otp-verify`} component={OtpVerification} />
       
          <Route component={NotFound} />

        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Lending;
