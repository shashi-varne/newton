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
import RecommendationFunds from "./RecommendationFunds"
import EditFunds from "./EditFunds"
import AlternateFunds from "./ReplaceFunds"
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
            <Route exact path={url} component={RecommendationFunds} />
            <Route path={`${url}/edit-funds`} component={EditFunds} />
            <Route path={`${url}/alternate-funds`} component={AlternateFunds} />
          </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default PortfolioRebalancing;
