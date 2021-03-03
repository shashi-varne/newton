import React, { useEffect } from 'react';
import WithdrawType from './components/WithdrawType';
import WithdrawReason from './components/WithdrawReason'
import WithdrawRemark from './components/WithdrawRemark'
import Landing from "./components/balance"
import WithdrawSwitch from './components/WithdrawSwitch'

import { Switch, Route, withRouter } from 'react-router-dom';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';

import './Style.scss'

import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';

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

const Withdraw = ({ match }) => {
  const { url } = match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <ScrollToTop />
          <Switch>
            <Route exact path={`${url}`} component={Landing} />
            <Route path={`${url}/reason`} component={WithdrawReason} />
            <Route path={`${url}/remark`} component={WithdrawRemark} />
            <Route path={`${url}/switch`} component={WithdrawSwitch} />
            <Route path={`${url}/:type`} component={WithdrawType} />
          </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Withdraw;
