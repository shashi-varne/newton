import React, { Fragment } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import '../common/theme/Style.scss';
import './common/Style.scss';
import './desktop/Style.scss';
import './mini-components/Style.scss';
import NotFound from '../common/components/NotFound';
import Login from './desktop/Login';
import NoPan from './desktop/NoPan';
import MainPage from './desktop/MainPage';
import AllTransactions from './desktop/AllTransactions';

const WealthReport = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
        <Switch>
          <Route exact path={`${url}`} component={Login} />
          <Route path={`${url}/login/:view`} component={Login} />
          <Route path={`${url}/login`} component={Login} />
          <Route path={`${url}/no-pan-screen`} component={NoPan} />
          <Route path={`${url}/transactions`} component={AllTransactions} />
          <Route path={`${url}/main/:tab`} component={MainPage} />
          <Route path={`${url}/main`} component={MainPage} />
          <Route component={NotFound} />
        </Switch>
    </Fragment>
  );
};

export default WealthReport;
