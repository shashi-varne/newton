import React from "react";
import { Route, Switch } from "react-router-dom";
import esignLaningContainer from "../../containers/nominee/esignLandingContainer";
import landingContainer from "../../containers/nominee/landingContainer";
import personalDetailsContainer from "../../containers/nominee/personalDetailsContainer";
import addressDetailsContainer from "../../containers/nominee/addressDetailsContainer";
import confirmNomineesContainer from "../../containers/nominee/confirmNomineesContainer";
import nomineeVerifiedContainer from "../../containers/nominee/nomineeVerifiedContainer";
import nomineeSubmittedContainer from "../../containers/nominee/nomineeSubmittedContainer";
import manualSignatureContainer from "../../containers/nominee/manualSignatureContainer";
import EsignStatusRedirectionContainer from "../../containers/nominee/esignStatusRedirectionContainer";
import NotFound from "../../designSystem/organisms/PageNotFound";

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
      <Route path={`${url}/verified`} component={nomineeVerifiedContainer} />
      <Route path={`${url}/submitted`} component={nomineeSubmittedContainer} />
      <Route
        exact
        path={`${url}/esign-landing`}
        component={esignLaningContainer}
      />
      <Route
        path={`${url}/manual-signature`}
        component={manualSignatureContainer}
      />
      <Route
        path={`${url}/esign-status`}
        component={EsignStatusRedirectionContainer}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Nominee;
