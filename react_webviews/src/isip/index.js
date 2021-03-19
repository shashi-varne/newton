import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
import './components/Style.css';

import './common/Style.css';
import NotFound from '../common/components/NotFound';

import BillerAbout from './components/biller/about';
import BillerDetails from './components/biller/details';
import BillerSteps from './components/biller/steps';

const IsipBIller = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
        <Switch>
          <Route exact path={`${url}/`} component={BillerAbout} />
          <Route path={`${url}/biller/about`} component={BillerAbout} />
          <Route path={`${url}/biller/details`} component={BillerDetails} />
          <Route path={`${url}/biller/steps`} component={BillerSteps} />
          <Route component={NotFound} />
        </Switch>
    </Fragment>
  );
};

export default IsipBIller;
