import React from "react";
import { Route, Switch } from "react-router-dom";
import withdrawPlacedContainer from "../../containers/referAndEarn/withdrawPlacedContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route
        path={`${url}/withdraw-placed`}
        component={withdrawPlacedContainer}
      />
    </Switch>
  );
};

export default ReferAndEarn;
