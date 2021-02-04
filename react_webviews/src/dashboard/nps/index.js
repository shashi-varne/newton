import React from "react";
import { Route, Switch } from "react-router-dom";
import NpsInfo from "./components/info";
import PanDetails from "./components/pan";
import EnterAmount from "./components/amount";
import ReplaceFund from "./components/fund_replace";
import Recommendations from "./components/recommendations";
import NpsIdentity from "./components/identity";
import NpsNominee from "./components/nominee";
import NpsDelivery from "./components/delivery";
import "../../common/theme/Style.scss";
import "./style.scss";

const Nps = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route exact path={`${url}/info`} component={NpsInfo} />
      <Route exact path={`${url}/pan`} component={PanDetails} />
      <Route exact path={`${url}/amount`} component={EnterAmount} />
      <Route exact path={`${url}/fundreplace`} component={ReplaceFund} />
      <Route exact path={`${url}/recommendations`} component={Recommendations} />
      <Route exact path={`${url}/identity`} component={NpsIdentity} />
      <Route exact path={`${url}/nominee`} component={NpsNominee} />
      <Route exact path={`${url}/delivery`} component={NpsDelivery} />
    </Switch>
  );
};

export default Nps;