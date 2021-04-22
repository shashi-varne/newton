import React, { Component, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset,
  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { themeConfig } from 'utils/constants';
import { withRouter } from "react-router";
import { ToastContainer } from 'react-toastify';

import InternalWealthDashboard from './internal_wealth_dashboard';

import Feature from './Feature';

import Tooltip from 'common/ui/Tooltip';
import 'common/theme/Style.scss';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

var basename = window.sessionStorage.getItem('base_href') || '';
if (basename && basename.indexOf('appl/webview') !== -1) {
  basename = basename ? basename + 'view/' : '';
}

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0)
      }
    }

    render() {
      return null;
    }
  }
);

const App = () => {
  
    return (
      <BrowserRouter basename={basename}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
          <ScrollToTop />
            <Tooltip />
            <ToastContainer autoClose={3000} />
            <Switch>
            <Route path="/iw-dashboard" component={InternalWealthDashboard} />
            <Route component={Feature}/>
            </Switch>
          </MuiThemeProvider>
        </JssProvider>
      </BrowserRouter>
    );
}

export default App;
