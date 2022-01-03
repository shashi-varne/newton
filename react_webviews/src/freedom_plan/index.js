import React from "react";
import { Route, Switch } from "react-router-dom";

import Landing from "./components/Landing";
import NotFound from "../common/components/NotFound";
import "./commonStyles.scss";

function FreedomPlan(props) {
  const { url } = props.match;
  return (
    <Switch>
      <Route exact path={`${url}`} component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default FreedomPlan;
