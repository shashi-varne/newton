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
import MobileVerify from "./components/forms/mobile_verify";
import OtpVerification from "./components/forms/otp_verify";
import JourneyMap from "./components/general/journey";
import KnowMore1 from "./components/knowMore/know_more1";
import KnowMore2 from "./components/knowMore/know_more2";
import KnowMore3 from "./components/knowMore/know_more3";
import Calculator from "./components/knowMore/calculator";
import IncomeDetails from "./components/general/income_details";
import BtInformation from "./components/bt_details/bt_info";

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
          <Route path={`${url}/journey-map`} component={JourneyMap} />
          <Route path={`${url}/know-more-1`} component={KnowMore1} />
          <Route path={`${url}/know-more-2`} component={KnowMore2} />
          <Route path={`${url}/know-more-3`} component={KnowMore3} />
          <Route path={`${url}/calculator`} component={Calculator} />
          <Route path={`${url}/income-details`} component={IncomeDetails} />
          <Route path={`${url}/bt-info`} component={BtInformation} />
       
          <Route component={NotFound} />

        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Lending;
