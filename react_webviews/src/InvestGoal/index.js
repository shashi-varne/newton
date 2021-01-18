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
import Landing from "./component/Landing"
import GoalType from "./component/GoalType"
import SaveGoal from "./component/SaveGoal"
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

const InvestGoal = ({ match }) => {
  const { url } = match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <ScrollToTop />
          <Switch>
          <Route exact path={`${url}`} component={Landing} />
          <Route exact path={`${url}/:subtype`} component={GoalType} />
          <Route path={`${url}/:subtype/:year`} component={SaveGoal} />

          </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default InvestGoal;
