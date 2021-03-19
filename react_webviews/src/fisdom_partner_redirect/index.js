import React, { Fragment } from 'react';

import { Switch, Route } from 'react-router-dom';
import Landing from "./component/Landing.js"
import Login from "./component/Login"

const FisdomPartnerRedirect = ({ match }) => {
  const { url } = match;
  return (
        <Fragment> 
          <Switch>
            <Route exact path={`${url}`} component={Landing} />
            <Route path={`${url}/login`} component={Login} />
          </Switch>
        </Fragment>
  );
};

export default FisdomPartnerRedirect;
