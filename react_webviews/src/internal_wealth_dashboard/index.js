import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import '../common/theme/Style.scss';
import './common/Style.scss';
import './pages/Style.scss';
import './mini-components/Style.scss';
import Login from './pages/Login';
import Main from './pages/Main';

const InternalWealthDashboard = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
          <Switch>
            <Route exact path={`${url}`} component={Login} />
            <Route path={`${url}/login/:view`} component={Login} />
            <Route path={`${url}/login`} component={Login} />
            <Route path={`${url}/main/:tab`} component={Main} />
          </Switch>
        
      </Fragment>
  );
};

export default InternalWealthDashboard;
