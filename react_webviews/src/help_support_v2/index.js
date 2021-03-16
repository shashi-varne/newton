import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { ToastContainer } from "react-toastify";

import './Style.scss';
import NotFound from "../common/components/NotFound";
import CategoryList from './components/categoryList';
import Queries from './components/queries';
import Category from "./components/category";
import Questions from "./components/questions";
import Answers from "./components/answers";
import TicketDetails from "./components/ticket_details";
import SendQuery from "./components/send_query";

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

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

const HelpSupport = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={CategoryList} />
          <Route path={`${url}/queries`} component={Queries} />
          <Route path={`${url}/category`} component={Category} />
          <Route path={`${url}/questions`} component={Questions} />
          <Route path={`${url}/answers`} component={Answers} />
          <Route path={`${url}/ticket-details`} component={TicketDetails} />
          <Route path={`${url}/send-query`} component={SendQuery} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default HelpSupport;
