import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";

import './common/style.scss'
import Referral from './components/Referral' 

const Partner = props => {
  const { url } = props.match;

  return (
    <Fragment>
      <Switch>
        <Route path={`${url}/referral`} component={Referral} />
      </Switch>
    </Fragment>
  );
};

export default Partner;
