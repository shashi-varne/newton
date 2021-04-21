import React, { Fragment } from "react";
import WithdrawType from "./components/WithdrawType";
import WithdrawReason from "./components/WithdrawReason";
import WithdrawRemark from "./components/WithdrawRemark";
import Landing from "./components/Balance";
import WithdrawSwitch from "./components/WithdrawSwitch";
import { Switch, Route } from "react-router-dom";
import NotFound from "../common/components/NotFound";
import SystemSummary from "./components/Summary/System";
import SelfSummary from "./components/Summary/Self";
import Insta from "./components/Summary/Insta";
import Otp from "./components/Otp";
import Success from "./components/Otp/Success";
import Failed from "./components/Otp/Failed";
import OtpSwitch from './components/Otp/OtpSwitch'

const Withdraw = ({ match }) => {
  const { url } = match;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${url}`} component={Landing} />
        <Route exact path={`${url}/switch/verify`} component={OtpSwitch} />
        <Route exact path={`${url}/system/summary`} component={SystemSummary} />
        <Route exact path={`${url}/self/summary`} component={SelfSummary} />
        <Route exact path={`${url}/systematic/summary`} component={SystemSummary} />
        <Route exact path={`${url}/insta-redeem/summary`} component={Insta} />
        <Route exact path={`${url}/reason`} component={WithdrawReason} />
        <Route exact path={`${url}/remark`} component={WithdrawRemark} />
        <Route exact path={`${url}/switch`} component={WithdrawSwitch} />
        <Route exact path={`${url}/verify`} component={Otp} />
        <Route exact path={`${url}/otp/success`} component={Success} />
        <Route exact path={`${url}/otp/failed`} component={Failed} />
        <Route exact path={`${url}/:type`} component={WithdrawType} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Withdraw;
