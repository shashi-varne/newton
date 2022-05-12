import React from "react";

import { Route, Switch } from "react-router-dom";

import addressDetailsContainer from "../../containers/nominee/addressDetailsContainer";

const Nominee = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route
        exact
        path={`${url}/address-details`}
        component={addressDetailsContainer}
      />
    </Switch>
  );
};

export default Nominee;
