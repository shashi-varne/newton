import React from "react";
import { Route, Switch } from "react-router-dom";

import Landing from "./pages/Landing";
import NotFound from "../common/components/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";

import "./commonStyles.scss";

function FreedomPlan(props) {
  const { url } = props.match;
  return (
    <Switch>
      <Route exact path={`${url}`} component={Landing} />
      <Route exact path={`${url}/payment/success`} component={PaymentSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default FreedomPlan;
