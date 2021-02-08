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
import NpsUpload from "./components/upload";
import NpsSuccess from "./components/success";
import NpsInvestments from "./components/investments";
import NpsPending from "./components/pending";
import NpsPerformance from "./components/performance";
import NpsPran from "./components/pran";
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
      <Route exact path={`${url}/upload`} component={NpsUpload} />
      <Route exact path={`${url}/success`} component={NpsSuccess} />
      <Route exact path={`${url}/investments`} component={NpsInvestments} />
      <Route exact path={`${url}/pending`} component={NpsPending} />
      <Route exact path={`${url}/performance`} component={NpsPerformance} />
      <Route exact path={`${url}/pran`} component={NpsPran} />
    </Switch>
  );
};

export default Nps;