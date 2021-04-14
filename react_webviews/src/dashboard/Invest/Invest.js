import React from "react";
import { Route, Switch } from "react-router-dom";
import "../../common/theme/Style.scss";

import NotFound from "../../common/components/NotFound";

import "./Style.scss";
import Landing from "./Landing";
import InstaRedeem from "./components/InstaRedeem";
import Type from "./components/InstaRedeem/Type";
import Amount from "./components/InstaRedeem/Amount";
import SaveTax from "./components/SaveTax";
import ParkMoney from "./components/ParkMoney";
import BuildWealth from "./components/BuildWealth";
import InvestGoal from "./components/InvestGoal";
import InvestAmount from "./mini-components/InvestAmount";
import InvestedAmount from "./mini-components/InvestedAmount";
import GoalType from "./components/InvestGoal/GoalType";
import SaveGoal from "./components/InvestGoal/SaveGoal";
import ExploreFunds from  "./components/Explore"
import FundType from "./components/Explore/FundType"
import Recommendations from "../Recommendation/Recommendation";
import EditFunds from "../Recommendation/EditFunds"
import AlternateFunds from "../Recommendation/ReplaceFunds"
import Target from "./components/InvestGoal/Target";
import RiskSelect from "./components/RiskPages/RiskSelect";
import RiskModify from "./components/RiskPages/RiskModify";
import RiskCustomize from "./components/RiskPages/RiskCustomize";

const Invest = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route
        exact
        path={`${url}`}
        component={Landing}
      />
      <Route
        exact
        path={`${url}/instaredeem`}
        component={InstaRedeem}
      />
      <Route
        exact
        path={`${url}/savetax`}
        component={SaveTax}
      />
      <Route
        exact
        path={`${url}/buildwealth`}
        component={BuildWealth}
      />
      <Route
        exact
        path={`${url}/parkmoney`}
        component={ParkMoney}
      />
      <Route
        exact
        path={`${url}/explore`}
        component={ExploreFunds}
      />
      <Route
        exact
        path={`${url}/explore/:type`}
        component={FundType}
      />
      <Route
        exact
        path={`${url}/recommendations`}
        component={Recommendations}
      />
      <Route
        exact
        path={`${url}/recommendations/edit-funds`}
        component={EditFunds}
      />
      <Route
        exact
        path={`${url}/recommendations/alternate-funds`}
        component={AlternateFunds}
      />
      <Route
        path={`${url}/instaredeem/type`}
        component={Type}
      />
      <Route
        path={`${url}/instaredeem/amount/:investType`}
        component={Amount}
      />
      <Route
        exact
        path={`${url}/savegoal`}
        component={InvestGoal}
      />
      <Route
        path={[
          `${url}/:type/amount`,
          `${url}/savegoal/:subtype/amount`
        ]}
        component={InvestAmount} />
      <Route
        path={`${url}/:type/risk-select`}
        component={RiskSelect}
      />
      <Route
        path={`${url}/:type/risk-select-skippable`}
        render={(props) => <RiskSelect canSkip {...props} />}
      />
      <Route
        path={`${url}/:type/risk-modify`}
        component={RiskModify}
      />
      <Route
        path={`${url}/:type/risk-customize`}
        component={RiskCustomize}
      />
      <Route
        path={`${url}/:type/funds`}
        component={InvestedAmount}
      />
      <Route
        exact
        path={`${url}/savegoal/:subtype`}
        component={GoalType}
      />
      <Route
        exact
        path={`${url}/savegoal/:subtype/target`}
        component={Target}
      />
      <Route
        exact
        path={`${url}/savegoal/:subtype/:year`}
        component={SaveGoal}
      />

      <Route component={NotFound} />
    </Switch>
  );
};

export default Invest;
