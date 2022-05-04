import React from "react";
import ESignLaningContainer from "../../containers/nominee/ESignLandingContainer";
import { Route, Switch } from "react-router-dom";

const Nominee = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route
        exact
        path={`${url}/esign-landing`}
        component={ESignLaningContainer}
      />
    </Switch>
  );
};

export default Nominee;
