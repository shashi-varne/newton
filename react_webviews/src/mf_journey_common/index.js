import React, { useEffect } from 'react';

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
import InvestAmount from "./InvestAmount"
import InvestedAmount from "./InvestedAmount"
import Landing from "./Landing"
import InvestJourney from "./InvestJourney"
import InvestExplore from "./InvestExplore"
import FundType from './FundType'
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
          <Switch>
          {/* <Route exact path={`${url}`} component={Landing} /> */}
            <Route path={`${url}/amount`} component={InvestAmount} />
            <Route path={`${url}/funds`} component={InvestedAmount} />
            <Route path={`${url}/invest-journey`} component={InvestJourney}/>
            <Route exact path={`${url}/amount`} component={InvestAmount} />
            <Route exact path={`${url}/funds`} component={InvestedAmount} />
            <Route exact path={`${url}/invest-journey`} component={InvestJourney}/>
            <Route exact path={`${url}/explore`} component={InvestExplore} />
            <Route exact path={`${url}/explore/:type`} component={FundType} />
            <Route path={`${url}`} component={Landing} />
          </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default PortfolioRebalancing;
