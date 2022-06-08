import React from "react";
import { Route, Switch } from "react-router-dom";
// import NotFound from "../../common/components/NotFound";
import bankListContainer from "../../containers/appLanding/bankListContainer";
import investingOptionsContainer from "../../containers/appLanding/investingOptionsContainer";
import landingContainer from "../../containers/appLanding/landingContainer";

const AppLanding = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route
        exact
        path={["/landing", "/mf", "/"]}
        component={landingContainer}
      />
      <Route
        exact
        path={`${url}landing/bank-list`}
        component={bankListContainer}
      />
      <Route
        exact
        path="/landing/view-all/:type"
        component={investingOptionsContainer}
      />
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
};

export default AppLanding;
