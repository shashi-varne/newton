import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import '../common/theme/Style.scss';
import { themeConfig } from 'utils/constants';
import { ToastContainer } from 'react-toastify';
import './common/Style.scss';
import './pages/Style.scss';
import './mini-components/Style.scss';
import NotFound from '../common/components/NotFound';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import Login from './pages/Login';
import Main from './pages/Main';
import HoldingDetail from './pages/HoldingDetail';

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
        window.scrollTo(0, 0);
      }
    }

    render() {
      return null;
    }
  }
);

const InternalWealthDashboard = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route exact path={`${url}`} component={Login} />
          <Route path={`${url}/login/:view`} component={Login} />
          <Route path={`${url}/login`} component={Login} />
          <Route path={`${url}/main/:tab`} component={Main} />
          <Route path={`${url}/fund-detail/:isin`} component={HoldingDetail} />
          {/* <Route path={`${url}/no-pan-screen`} component={NoPan} />
          <Route path={`${url}/transactions`} component={AllTransactions} />
          <Route path={`${url}/main/:tab`} component={MainPage} />
          <Route component={NotFound} />*/}
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default InternalWealthDashboard;
