import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
import './components/Style.css';

import './common/Style.css';
import NotFound from '../common/components/NotFound';
import RequestAbout from './components/about';
import RequestBank from './components/bank';
import RequestFailure from './components/failure';
import RequestSuccess from './components/success';
import RequestRedirection from './components/redirection';
import eMandateOtp from './components/otp';



// consent
import ConsentAbout from './components/consent/about';
import ConsentOtp from './components/consent/otp';
import ConsentSuccess from './components/consent/success';

// enps
import EnpsConsentAbout from './components/enps/about';
import EnpsConsentSuccess from './components/enps/success';
import EnpsConsentFailure from './components/enps/failure';
import EnpsRedirection from './components/enps/redirection';
import EnpsConsentOtp from './components/enps/otp';

const Mandate_OTM = (props) => {
  const { url } = props.match;

  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}`} component={RequestAbout} />
        <Route path={`${url}/select-bank`} component={RequestBank} />
        <Route path={`${url}/redirection`} component={RequestRedirection} />
        <Route path={`${url}/failure`} component={RequestFailure} />
        <Route path={`${url}/success`} component={RequestSuccess} />
        <Route path={`${url}/otp`} component={eMandateOtp} />

        {/*consent  */}
        <Route path={`${url}/consent/about`} component={ConsentAbout} />
        <Route path={`${url}/consent/otp`} component={ConsentOtp} />
        <Route path={`${url}/consent/success`} component={ConsentSuccess} />

        {/*enps  */}
        <Route path={`${url}/enps/about`} component={EnpsConsentAbout} />
        <Route path={`${url}/enps/redirection`} component={EnpsRedirection} />
        <Route path={`${url}/enps/failure`} component={EnpsConsentFailure} />
        <Route path={`${url}/enps/success`} component={EnpsConsentSuccess} />
        <Route path={`${url}/enps/otp`} component={EnpsConsentOtp} />


        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Mandate_OTM;
