import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.scss';
import './components/Style.css';
import { themeConfig } from 'utils/constants';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import RequestAbout from './components/form_request/about';
import RequestAddress from './components/form_request/address';
import RequestSuccess from './components/form_request/success';

import Upload from './components/form_upload/upload';
import UploadSuccess from './components/form_upload/upload_success';
import SendEmail from './components/form_upload/send_email';
import EmailSuccess from './components/form_upload/email_success';
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
