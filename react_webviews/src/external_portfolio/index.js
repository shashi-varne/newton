import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "./components/Style.scss";
import "./mini-components/Style.scss";
import { themeConfig } from 'utils/constants';
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";
import { ToastContainer } from 'react-toastify';

// Component Paths
import Email_entry from './components/email_entry';
import StatementRequestPage from './components/statement_request';
import EmailNotReceived from './components/email_not_received';
import EmailExampleView from './components/email_example_view';
import StatementNotReceived from './components/statement_not_received';
import FundHoldings from './components/fund_holdings';
import ExternalPortfolio from './components/external_portfolio';
import Settings from './components/settings';
import PANSelector from './components/select_PAN';
// 

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f"
});
const jss = create(jssPreset());
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

function external_portfolio(props) {
  const { url } = props.match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route path={`${url}/email_entry`} component={Email_entry} />
          <Route path={`${url}/statement_request/:email`} component={StatementRequestPage} />
          <Route path={`${url}/email_not_received`} component={EmailNotReceived} />
          <Route path={`${url}/email_example_view`} component={EmailExampleView} />
          <Route path={`${url}/statement_not_received`} component={StatementNotReceived} />
          <Route path={`${url}/external_portfolio`} component={ExternalPortfolio} />
          <Route path={`${url}/settings`} component={Settings} />
          <Route path={`${url}/select_pan`} component={PANSelector} />
          <Route path={`${url}/fund_holdings`} component={FundHoldings} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
}

export default external_portfolio;