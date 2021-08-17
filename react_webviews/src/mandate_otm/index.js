import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
import './components/Style.css';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import RequestAbout from './components/form_request/about';
import RequestAddress from './components/form_request/address';
import RequestSuccess from './components/form_request/success';

import Upload from './components/form_upload/upload';
import UploadSuccess from './components/form_upload/upload_success';
import SendEmail from './components/form_upload/send_email';
import EmailSuccess from './components/form_upload/email_success';

const Mandate_OTM = (props) => {
  const { url } = props.match;

  return (
   <Fragment>
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
    </Fragment>
  );
};

export default Mandate_OTM;
