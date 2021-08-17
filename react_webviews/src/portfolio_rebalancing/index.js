import React, { Fragment } from 'react';
import Landing from './component/Landing.js';

import { Switch, Route } from 'react-router-dom';
import RebalanceSuccessful from './component/RebalanceSuccessful';
import ErrorPage from './component/ErrorPage';
import Otp from './component/Otp';
import SIPDate from './component/SipDate';

import RebalanceFund from './component/RebalanceFund';
import ErrorBoundary from './component/ErrorBoundary';

const PortfolioRebalancing = ({ match }) => {
  const { url } = match;
  return (
  <Fragment>
        <ErrorBoundary>
          <Switch>
            <Route exact path={`${url}`} component={Landing} />
            <Route path={`${url}/rebalance-fund`} component={RebalanceFund} />
            <Route path={`${url}/rebalance-success`} component={RebalanceSuccessful} />
            <Route path={`${url}/otp`} component={Otp} />
            <Route path={`${url}/sip-date`} component={SIPDate} />
            <Route path={`${url}/error`} component={ErrorPage} />
          </Switch>
        </ErrorBoundary>
   </Fragment>
  );
};

export default PortfolioRebalancing;
