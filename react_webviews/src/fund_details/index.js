import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import FundDetails from './components/FundDetails';

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
