import React from "react";
import { Route, Switch } from "react-router-dom";

import Landing from "./pages/Landing";
import NotFound from "../common/components/NotFound";
import PlanReview from "./pages/PlanReview";

import "./commonStyles.scss";

function FreedomPlan(props) {
  const { url } = props.match;
  return (
    <Switch>
      <Route exact path={`${url}`} component={Landing} />
      <Route exact path={`${url}/review`} component={PlanReview} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default FreedomPlan;
