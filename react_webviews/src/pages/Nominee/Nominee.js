import React from "react";
import ESignLaningContainer from "../../containers/nominee/ESignLandingContainer";
import { Route, Switch } from "react-router-dom";
import manualSignatureContainer from "../../containers/nominee/manualSignatureContainer";
import landingContainer from "../../containers/nominee/landingContainer";

import addressDetailsContainer from "../../containers/nominee/addressDetailsContainer";

const Nominee = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route
        exact
        path={`${url}/esign-landing`}
        component={ESignLaningContainer}
      />
      <Route path={`${url}/landing`} component={landingContainer} />
      <Route
        exact
        path={`${url}/address-details`}
        component={addressDetailsContainer}
      />
      <Route
        path={`${url}/manual-signature`}
        component={manualSignatureContainer}
      />
    </Switch>
  );
};

export default Nominee;
