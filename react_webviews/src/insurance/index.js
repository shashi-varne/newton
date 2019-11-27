import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.css';
import { getConfig } from 'utils/functions';
import { ToastContainer } from 'react-toastify';

import './common/Style.css';
import './components/Style.css';
import NotFound from '../common/components/NotFound';

import AppUpdateInfo from './components/app_update.js';

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
      // light: '#0066ff',
      main: getConfig().default,
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    }
    // error: will us the default color
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%'
      }
    },
    MuiInput: {
      input: {
        padding: '11px 0 7px',
        fontSize: '14px'
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: '0.9rem',
        color: getConfig().label,
        fontWeight: 'normal'
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.85)'
      }
    },
    MuiButton: {
      raisedSecondary: {
        '&:hover': {
          backgroundColor: getConfig().secondary
        }
      }
    },
    MuiIconButton: {
      root: {
        height: '56px'
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

const Insurance = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={AppUpdateInfo} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Insurance;
