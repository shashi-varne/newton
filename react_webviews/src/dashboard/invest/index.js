import React from "react";
import { Route, Switch } from "react-router-dom";
import "../../common/theme/Style.scss";

import NotFound from "../../common/components/NotFound";

import "./Style.scss";
import Landing from "./landing";
import InstaRedeem from "./components/insta_redeem";
import Type from "./components/insta_redeem/type";
import Amount from "./components/insta_redeem/amount";
import SaveTax from "./components/savetax";
import ParkMoney from "./components/parkmoney";
import BuildWealth from "./components/buildwealth";
import InvestGoal from "./components/InvestGoal";
import InvestAmount from "./components/mini_components/InvestAmount";
import InvestedAmount from "./components/mini_components/InvestedAmount";
import GoalType from "./components/InvestGoal/component/GoalType";
import SaveGoal from "./components/InvestGoal/component/SaveGoal";
import ExploreFunds from  "./components/explore"
import FundType from "./components/explore/FundType"
import Recommendations from "../Recommendation";
import EditFunds from "../Recommendation/EditFunds"
import AlternateFunds from "../Recommendation/ReplaceFunds"
import Target from "./components/InvestGoal/component/Target";

import { isIframe } from 'utils/functions';
import { getConfig } from "../../utils/functions";

const Invest = (props) => {
  const { url } = props.match;
  const partnerCode = getConfig().partner_code;

  return (
    <Switch>
      <Route exact path={`${url}`} component={isIframe() && partnerCode === 'moneycontrol' ? ExploreFunds : Landing} />
      <Route exact path={`${url}/instaredeem`} component={InstaRedeem} />
      <Route exact path={`${url}/savetax`} component={SaveTax} />
      <Route exact path={`${url}/buildwealth`} component={BuildWealth} />
      <Route exact path={`${url}/parkmoney`} component={ParkMoney} />
      <Route exact path={`${url}/explore`} component={ExploreFunds} />
      <Route exact path={`${url}/explore/:type`} component={FundType} />
      <Route exact path={`${url}/recommendations`} component={Recommendations} />
      <Route exact path={`${url}/recommendations/edit-funds`} component={EditFunds} />
      <Route exact path={`${url}/recommendations/alternate-funds`} component={AlternateFunds} />
      <Route path={`${url}/instaredeem/type`} component={Type} />
      <Route path={`${url}/instaredeem/amount/:investType`} component={Amount} />
      <Route exact path={`${url}/savegoal`} component={InvestGoal} />
      <Route path={[`${url}/:type/amount`,`${url}/savegoal/:subtype/amount`]} component={InvestAmount} />
      <Route path={`${url}/:type/funds`} component={InvestedAmount} />
      <Route exact path={`${url}/savegoal/:subtype`} component={GoalType} />
      <Route exact path={`${url}/savegoal/:subtype/target`} component={Target} />
      <Route exact path={`${url}/savegoal/:subtype/:year`} component={SaveGoal} />

      <Route component={NotFound} />
    </Switch>
  );
};

export default Invest;
