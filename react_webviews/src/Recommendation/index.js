import React from "react";

import { Switch, Route } from "react-router-dom";
import RecommendationFunds from "./RecommendationFunds";
import EditFunds from "./EditFunds";
import AlternateFunds from "./ReplaceFunds";
const PortfolioRebalancing = ({ match }) => {
  const { url } = match;
  return (
    <Switch>
      <Route exact path={url} component={RecommendationFunds} />
      <Route path={`${url}/edit-funds`} component={EditFunds} />
      <Route path={`${url}/alternate-funds`} component={AlternateFunds} />
    </Switch>
  );
};

export default PortfolioRebalancing;
