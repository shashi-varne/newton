import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "../common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { ToastContainer } from "react-toastify";

import NotFound from "../common/components/NotFound";

import "./invest/Style.scss";
import Landing from "./invest";

import NfoInfo from "./invest/components/nfo";
import NfoScheme from "./invest/components/nfo/scheme";
import NfoFunds from "./invest/components/nfo/funds";
import NfoFundDetail from "./invest/components/nfo/FundDetail";
import NfoCheckout from "./invest/components/nfo/checkout";
import SipDates from "./invest/components/nfo/SipDates";
import InvestJourney from "./investJourney";
import DIY from "./diy";
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

import MyAccount from './components/my_account';
import Notification from './components/notification';
import PaymentCallback from "./invest/components/PaymentCallback";
import SipPaymentCallback from "./invest/components/SipPaymentCallback";

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f",
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

const Invest = (props) => {
  const { url } = props.match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Landing} />
          <Route path={`${url}invest`} component={Landing} />
          <Route path={`${url}landing`} component={Landing} />
          <Route path={`${url}diy`} component={DIY} />
          <Route path={`${url}invest-journey`} component={InvestJourney} />
          <Route
            path={`${url}advanced-investing/new-fund-offers/info`}
            component={NfoInfo}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/scheme`}
            component={NfoScheme}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/:scheme/funds`}
            component={NfoFunds}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/fund`}
            component={NfoFundDetail}
          />
          <Route
            path={`${url}advanced-investing/new-fund-offers/funds/checkout`}
            render={(props) => <NfoCheckout {...props} type="nfo" />}
          />
          <Route path={`${url}sipdates`} component={SipDates} />

          <Route path={`${url}my-account`} component={MyAccount} />
          <Route path={`${url}notification`} component={Notification} />

          <Route path={`${url}payment/callback/:status/:message`} component={PaymentCallback} />
          <Route path={`${url}sip/payment/callback/:status/:message`} component={SipPaymentCallback} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Invest;
