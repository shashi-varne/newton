import React from "react";

import { Route, Switch } from "react-router-dom";

import personalDetailsContainer from "../../containers/nominee/personalDetailsContainer";

const Nominee = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route
        exact
        path={`${url}/personal-details`}
        component={personalDetailsContainer}
      />
    </Switch>
  );
};

export default Nominee;
