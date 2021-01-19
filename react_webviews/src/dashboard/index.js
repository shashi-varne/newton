import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "../common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { ToastContainer } from "react-toastify";

import NotFound from "../common/components/NotFound";

import "./Style.scss";
import Landing from "./invest/landing";

import InstaRedeem from "./invest/insta_redeem";
import Type from "./invest/insta_redeem/type";
import Amount from "./invest/insta_redeem/amount";

import NfoInfo from "./invest/nfo";
import NfoScheme from "./invest/nfo/scheme";
import NfoFunds from "./invest/nfo/funds";
import NfoFundDetail from "./invest/nfo/FundDetail";
import NfoCheckout from "./invest/nfo/checkout";

import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

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
          <Route exact path={`${url}invest`} component={Landing} />
          <Route
            exact
            path={`${url}invest/instaredeem`}
            component={InstaRedeem}
          />
          <Route path={`${url}invest/instaredeem/type`} component={Type} />
          <Route
            path={`${url}invest/instaredeem/amount/:investType`}
            component={Amount}
          />
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
            component={NfoCheckout}
          />

          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Invest;
