import React from "react";

import { Route, Switch } from "react-router-dom";

import confirmNomineesContainer from "../../containers/nominee/confirmNomineesContainer";

const Nominee = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route
        exact
        path={`${url}/confirm-nominees`}
        component={confirmNomineesContainer}
      />
    </Switch>
  );
};

export default Nominee;
