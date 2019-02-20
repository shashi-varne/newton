import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.css';
import './components/Style.css';
import { getConfig } from 'utils/functions';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import RequestAbout from './components/form_request/about';
import RequestAddress from './components/form_request/address';
import RequestSuccess from './components/form_request/success';

import Upload from './components/form_upload/upload';
import UploadSuccess from './components/form_upload/upload_success';
import SendEmail from './components/form_upload/send_email';
import EmailSuccess from './components/form_upload/email_success';

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
        fontSize: '14px',
        color: '#4a4a4a',
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

const Mandate_OTM = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <Switch>
          <Route exact path={`${url}`} component={RequestAbout} />
          <Route path={`${url}/form-request/about`} component={RequestAbout} />
          <Route path={`${url}/form-request/address`} component={RequestAddress} />
          <Route path={`${url}/form-request/success`} component={RequestSuccess} />

          <Route path={`${url}/form-upload/upload`} component={Upload} />
          <Route path={`${url}/form-upload/upload-success`} component={UploadSuccess} />
          <Route path={`${url}/form-upload/send-email`} component={SendEmail} />
          <Route path={`${url}/form-upload/email-success`} component={EmailSuccess} />
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Mandate_OTM;
