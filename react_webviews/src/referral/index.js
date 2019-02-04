import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import '../common/theme/Style.css';
import './common/Style.css';
import { getConfig } from 'utils/functions';
import NotFound from '../common/components/NotFound';
import Details from './components/details';
import Earnings from './components/earnings';
import Terms from './components/terms';

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

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: getConfig().primary,
      // dark: will be calculated from palette.primary.main,
      contrastText: '#ffffff',
    },
    secondary: {
      // light: '#0066ff',
      main: getConfig().secondary,
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    default: {
      main: getConfig().default,
      contrastText: '#ffffff'
    }
    // error: will us the default color
  },
  overrides: {
    MuiButton: {
      raisedSecondary: {
        '&:hover': {
          backgroundColor: '#1bda4e'
        }
      }
    }
  }
});

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

const Referral = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <Switch>
          <Route exact path={`${url}`} component={Details} />
          <Route path={`${url}/earnings`} component={Earnings} />
          <Route path={`${url}/terms`} component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Referral;
