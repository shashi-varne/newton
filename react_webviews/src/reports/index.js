import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "./Style.scss";
import NotFound from "common/components/NotFound";

import Summary from "./components/Summary/Summary";
import Goals from "./components/Goals";
import Funds from "./components/Funds";
import FundswiseSummary from "./components/Fundwise/Summary";
import FundswiseDetails from "./components/Fundwise/Details";
import FundswiseTransactions from "./components/Fundwise/Transactions";
import Purchase from "./components/Purchase";
import Redeemed from "./components/Redeemed";
import SwitchFund from "./components/SwitchFund";
import SwitchNow from "./components/SwitchNow";
import Sip from "./components/Sip/Sip";
import SipDetails from "./components/Sip/SipDetails";
import Action from "./components/Sip/Action";
import PausePeriod from "./components/Sip/PausePeriod";
import PauseCancelDetail from "./components/Sip/PauseCancelDetail";
import Otp from "./components/Sip/Otp";
import Request from "./components/Sip/Request";
import PauseResumeRestart from "./components/Sip/PauseResumeRestart";
import SwitchedTransaction from "./components/SwitchedTransaction";
import InvestMore from "./components/InvestMore";

const Reports = (props) => {
  const { url } = props.match;
  return (
    <Fragment>
      <Switch>
        <Route path={url} exact component={Summary} />
        <Route path={`${url}/goals`} exact component={Goals} />
        <Route path={`${url}/goals/funds/:itype/`} exact component={Funds} />
        <Route path={`${url}/goals/funds/:itype/:subtype`} exact component={Funds} />
        <Route path={`${url}/fundswise/summary`} exact component={FundswiseSummary} />
        <Route path={`${url}/fundswise/details/:dataindex`} exact component={FundswiseDetails} />
        <Route path={`${url}/transactions/:amfi`} exact  render={(props) => <FundswiseTransactions {...props} type='fundswise' />} />
        <Route path={`${url}/transactions`} exact component={FundswiseTransactions} />
        <Route path={`${url}/purchased-transaction`} exact component={Purchase} />
        <Route path={`${url}/redeemed-transaction`} exact component={Redeemed} />
        <Route path={`${url}/fundswise/switch/:amfi`} exact component={SwitchFund} />
        <Route path={`${url}/fundswise/switch-now/:amfi`} exact component={SwitchNow} />
        <Route path={`${url}/sip`} exact component={Sip} />
        <Route path={`${url}/sip/details`} exact component={SipDetails} />
        <Route path={`${url}/sip/pause-action/:action`} exact component={Action} />
        <Route path={`${url}/sip/pause-period`} exact component={PausePeriod} />
        <Route path={`${url}/sip/pause-cancel-detail/:action/:period`} exact component={PauseCancelDetail} />
        <Route path={`${url}/sip/otp/:action`} exact component={Otp} />
        <Route path={`${url}/sip/pause-request`} exact component={Request} />
        <Route path={`${url}/sip/pause-resume-restart/:action/:next_sip_date`} exact component={PauseResumeRestart} />
        <Route path={`${url}/switched-transaction`} exact component={SwitchedTransaction} />
        <Route path={`${url}/invest/:mode`} exact component={InvestMore} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  );
};

export default Reports;
