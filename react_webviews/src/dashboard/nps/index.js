import React from "react";
import { Route, Switch } from "react-router-dom";
import NpsInfo from "./components/additional/info";
import PanDetails from "./components/additional/pan";
import EnterAmount from "./components/amount";
import ReplaceFund from "./components/fund_replace";
import Recommendations from "./components/recommendations";
import NpsIdentity from "./components/additional/identity";
import NpsNominee from "./components/additional/nominee";
import NpsDelivery from "./components/additional/delivery";
import NpsUpload from "./components/additional/upload";
import NpsSuccess from "./components/success";
import NpsInvestments from "./components/investments";
import NpsPending from "./components/pending";
import NpsPerformance from "./components/performance";
import NpsPran from "./components/additional/pran";
import NpsPaymentCallback from "./components/payment";
import NpsInvestType from "./components/investType";
import NpsSdk from "./components/npsSdk";
import "../../common/theme/Style.scss";
import "./style.scss";
import NpsPaymentRedirect from "./components/redirect";
import NotFound from 'common/components/NotFound'

const Nps = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route exact path={`${url}/info`} component={NpsInfo} />
      <Route exact path={`${url}/pan`} component={PanDetails} />
      <Route exact path={`${url}/amount/:type`} component={EnterAmount} />
      <Route exact path={`${url}/fundreplace`} component={ReplaceFund} />
      <Route exact path={`${url}/recommendation/:type`} component={Recommendations} />
      <Route exact path={`${url}/identity`} component={NpsIdentity} />
      <Route exact path={`${url}/nominee`} component={NpsNominee} />
      <Route exact path={`${url}/delivery`} component={NpsDelivery} />
      <Route exact path={`${url}/upload`} component={NpsUpload} />
      <Route exact path={`${url}/success`} component={NpsSuccess} />
      <Route exact path={`${url}/investments`} component={NpsInvestments} />
      <Route exact path={`${url}/pending`} component={NpsPending} />
      <Route exact path={`${url}/performance`} component={NpsPerformance} />
      <Route exact path={`${url}/pran`} component={NpsPran} />
      <Route exact path={`${url}/redirect`} component={NpsPaymentRedirect} />
      <Route exact path={`${url}/invest-type`} component={NpsInvestType} />
      <Route exact path={`${url}/payment/callback/:type/:amount/:id`} component={NpsPaymentCallback} />
      <Route exact path={`${url}/payment/callback/:type/:amount/:id/:status`} component={NpsPaymentCallback} />
      <Route exact path={`${url}/payment/callback/:type/:amount/:id/:status/:message`} component={NpsPaymentCallback} />
      <Route exact path={`${url}/sdk`} component={NpsSdk} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Nps;