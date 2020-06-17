import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "./components/Style.scss";
import { themeConfig } from 'utils/constants';
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

// Component Paths
import Landing from './components/landing.js';
import Email_entry from './components/email_entry';
import StatementRequest from './components/statement_request_update';
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
        <Switch>
          <Route exact path={`${url}`} component={Landing} />
          <Route path={`${url}/email_entry`} component={Email_entry} />
          <Route path={`${url}/statement_request`} component={StatementRequest} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
}

export default external_portfolio;