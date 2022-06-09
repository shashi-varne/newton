import React from "react";
import { Route, Switch } from "react-router-dom";
import successDetailsContainer from "../../containers/referAndEarn/successDetailsContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route
        path={`${url}/success-details`}
        component={successDetailsContainer}
      />
    </Switch>
  );
};

export default ReferAndEarn;
