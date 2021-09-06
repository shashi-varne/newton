import React from 'react';
import { Route, Switch } from 'react-router-dom';
import GenerateStatement from './pages/GenerateStatement';
import Landing from './pages/Landing';

function AccountStatements(props) {
  const { url } = props.match;
  console.log(url);
  return (
    <Switch>
      <Route exact path={`${url}/:pageType`} component={GenerateStatement} />
      <Route exact path={`${url}`} component={Landing} />
    </Switch>
  )
}

export default AccountStatements;
