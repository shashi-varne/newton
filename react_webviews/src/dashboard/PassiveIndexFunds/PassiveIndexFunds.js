import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../../common/components/NotFound";
import Landing from "./components/PassiveFundLanding"
import FundList from "./components/PassiveFundList.js"
import PassiveFundDetails from "./components/PassiveFundDetails";
import "../../common/theme/Style.scss";
import "./style.scss";


const PassiveIndexFunds = (props) => {
  const { url } = props.match;
  return (
    <Switch>
      <Route path={`${url}/landing`} component={Landing} />
      <Route path={`${url}/:category/fund-list`} component={FundList} />
      <Route path={`${url}/fund-details`} exact component={PassiveFundDetails} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default PassiveIndexFunds;
