import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FundDetails from './components/FundDetails';
import { Fragment } from 'react';

const FundInfo = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route path={url} exact component={FundDetails} />
      </Switch>
    </Fragment>
  );
};

export default FundInfo;
