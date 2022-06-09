import React from "react";
import { Route, Switch } from "react-router-dom";
import tncContainer from "../../containers/referAndEarn/tncContainer";

const ReferAndEarn = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route
        path={`${url}/tnc`}
        component={tncContainer}
      />
    </Switch>
  );
};

export default ReferAndEarn;
