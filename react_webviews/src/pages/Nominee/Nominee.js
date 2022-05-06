import React from "react";
import ESignLaningContainer from "../../containers/nominee/ESignLandingContainer";
import { Route, Switch } from "react-router-dom";
import landingContainer from "../../containers/nominee/landingContainer";
import personalDetailsContainer from "../../containers/nominee/personalDetailsContainer";
import addressDetailsContainer from "../../containers/nominee/addressDetailsContainer";
import confirmNomineesContainer from "../../containers/nominee/confirmNomineesContainer";
import NomineeVerifiedContainer from "../../containers/nominee/nomineeVerifiedContainer";
import NomineeSubmittedContainer from "../../containers/nominee/nomineeSubmittedContainer";
import manualSignatureContainer from "../../containers/nominee/manualSignatureContainer";

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
      <Route path={`${url}/verified`} component={NomineeVerifiedContainer} />
      <Route path={`${url}/submitted`} component={NomineeSubmittedContainer} />
      <Route
        exact
        path={`${url}/esign-landing`}
        component={ESignLaningContainer}
      />
      <Route
        path={`${url}/manual-signature`}
        component={manualSignatureContainer}
      />
    </Switch>
  );
};

export default Nominee;
