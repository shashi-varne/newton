import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../../common/components/NotFound";
import bankListContainer from "../../containers/appLanding/bankListContainer";
import investingOptionsContainer from "../../containers/appLanding/investingOptionsContainer";
import landingContainer from "../../containers/appLanding/landingContainer";
import mfLandingContainer from "../../containers/appLanding/mfLandingContainer";

const AppLanding = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route exact path="/landing-new" component={landingContainer} />
      <Route exact path="/bank-list" component={bankListContainer} />
      <Route exact path="/mf-landing" component={mfLandingContainer} />
      <Route
        exact
        path="/mf-landing/view-all"
        component={investingOptionsContainer}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppLanding;
