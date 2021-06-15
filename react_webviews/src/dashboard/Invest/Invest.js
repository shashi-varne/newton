import "../../common/theme/Style.scss";
import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../../common/components/NotFound";
import Landing from "./components/Landing";
import InstaRedeem from "./components/InstaRedeem";
import Type from "./components/InstaRedeem/Type";
import Amount from "./components/InstaRedeem/Amount";
import SaveTax from "./components/SaveTax";
import ParkMoney from "./components/ParkMoney";
import BuildWealth from "./components/BuildWealth";
import GoalType from "./components/InvestGoal";
import InvestAmount from "./mini-components/InvestAmount";
import InvestedAmount from "./mini-components/InvestedAmount";
import SelectYear from "./components/InvestGoal/SelectYear";
import GoalTarget from "./components/InvestGoal/GoalTarget";
import ExploreFunds from  "./components/Explore"
import FundType from "./components/Explore/FundType"
import Recommendations from "../Recommendation/Recommendation";
import EditFunds from "../Recommendation/EditFunds"
import AlternateFunds from "../Recommendation/ReplaceFunds"
import CustomGoalTarget from "./components/InvestGoal/CustomGoalTarget";
import RiskSelect from "./components/RiskPages/RiskSelect";
import RiskModify from "./components/RiskPages/RiskModify";
import RiskCustomize from "./components/RiskPages/RiskCustomize";
import RiskInfo from "./components/RiskPages/RiskInfo";
import HowWeRecommend from "../Recommendation/HowWeRecommend";

const Invest = (props) => {
  const { url } = props.match; console.log(url)
  return (
    <Switch>
      <Route
        exact
        path={`${url}`}
        component={Landing}
      />
      <Route
        exact
        path={`${url}/srik`}
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
        path={`${url}/recommendations/how-we-recommend`}
        component={HowWeRecommend}
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
        path={`${url}/instaredeem/amount`}
        component={Amount}
      />
      <Route
        exact
        path={`${url}/savegoal`}
        component={GoalType}
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
        path={`${url}/risk-info`}
        component={RiskInfo}
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
        component={SelectYear}
      />
      <Route
        exact
        path={`${url}/savegoal/:subtype/:year/target`}
        component={CustomGoalTarget}
      />
      <Route
        exact
        path={`${url}/savegoal/:subtype/:year`}
        component={GoalTarget}
      />

      <Route component={NotFound} />
    </Switch>
  );
};

export default Invest;
