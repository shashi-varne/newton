import React, { useEffect } from 'react';
import Landing from './component/Landing.js';

import { Switch, Route, withRouter } from 'react-router-dom';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';
import RebalanceSuccessful from './component/RebalanceSuccessful';
import ErrorPage from './component/ErrorPage';
import Otp from './component/Otp';
import SIPDate from './component/SipDate';

import RebalanceFund from './component/RebalanceFund';
import ErrorBoundary from './component/ErrorBoundary';
const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: 'f',
});
const jss = create(jssPreset());
const theme = createMuiTheme(themeConfig);
const ScrollToTopWithoutRouter = (props) => {
  const { location } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};
const ScrollToTop = withRouter(ScrollToTopWithoutRouter);

const PortfolioRebalancing = ({ match }) => {
  const { url } = match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <ScrollToTop />
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
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default PortfolioRebalancing;
