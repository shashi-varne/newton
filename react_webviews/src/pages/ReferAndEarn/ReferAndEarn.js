import React from "react";
import { Route, Switch } from "react-router-dom";
import landingContainer from "../../containers/referAndEarn/landingContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/landing`} component={landingContainer} />
    </Switch>
  );
};

export default ReferAndEarn;
