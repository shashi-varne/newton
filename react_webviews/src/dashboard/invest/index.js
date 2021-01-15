import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "../../common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { ToastContainer } from "react-toastify";

import NotFound from "../../common/components/NotFound";

import "./Style.scss";
import Landing from "./landing";
import InstaRedeem from "./insta_redeem";
import Type from "./insta_redeem/type";
import Amount from "./insta_redeem/amount";

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
          <Route exact path={`${url}`} component={Landing} />
          <Route exact path={`${url}/instaredeem`} component={InstaRedeem} />
          <Route path={`${url}/instaredeem/type`} component={Type} />
          <Route path={`${url}/instaredeem/amount/:investType`} component={Amount} />

          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Invest;
