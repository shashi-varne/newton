import React from "react";
import { Route, Switch } from "react-router-dom";
import landingContainer from "../../containers/nominee/landingContainer";
import personalDetailsContainer from "../../containers/nominee/personalDetailsContainer";
import addressDetailsContainer from "../../containers/nominee/addressDetailsContainer";
import confirmNomineesContainer from "../../containers/nominee/confirmNomineesContainer";

const Nominee = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/landing`} component={landingContainer} />
      <Route
        exact
        path={`${url}/personal-details`}
        component={personalDetailsContainer}
      />
      <Route
        exact
        path={`${url}/address-details`}
        component={addressDetailsContainer}
      />
      <Route
        exact
        path={`${url}/confirm-nominees`}
        component={confirmNomineesContainer}
      />
    </Switch>
  );
};

export default Nominee;
