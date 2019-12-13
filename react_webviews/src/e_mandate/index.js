import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.css';
import './components/Style.css';
import { themeConfig } from 'utils/constants';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import RequestAbout from './components/about';
import RequestBank from './components/bank';
import RequestFailure from './components/failure';
import RequestSuccess from './components/success';
import { ToastContainer } from 'react-toastify';

import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// jss.options.insertionPoint = 'jss-insertion-point';

const theme = createMuiTheme(themeConfig);

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

const Mandate_OTM = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={RequestAbout} />
          <Route path={`${url}/select-bank`} component={RequestBank} />
          <Route path={`${url}/failure`} component={RequestFailure} />
          <Route path={`${url}/success`} component={RequestSuccess} />
          
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Mandate_OTM;
