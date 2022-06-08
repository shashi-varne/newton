import React from "react";
import { Route, Switch } from "react-router-dom";
import withdrawPlacedContainer from "../../containers/referAndEarn/withdrawPlacedContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route
        path={`${url}/withdrawal-placed`}
        component={withdrawPlacedContainer}
      />
    </Switch>
  );
};

export default ReferAndEarn;
