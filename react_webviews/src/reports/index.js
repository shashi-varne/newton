import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import React from "react";
import { Route, Switch } from "react-router-dom";
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import { themeConfig } from "utils/constants";
import "./Style.scss";
import NotFound from "common/components/NotFound";

import Summary from "./components/Summary";
import Goals from "./components/Goals";
import Funds from "./components/Funds";
import FundswiseSummary from "./components/fundwise/Summary";
import FundswiseDetails from "./components/fundwise/Details";
import FundswiseTransactions from "./components/fundwise/Transactions";
import Purchase from "./components/Purchase";
import Redeemed from "./components/Redeemed";
import SwitchFund from "./components/SwitchFund";
import SwitchNow from "./components/SwitchNow";
import Sip from "./components/sip/Sip";
import SipDetails from "./components/sip/SipDetails";
import Action from "./components/sip/Action";
import PausePeriod from "./components/sip/PausePeriod";
import PauseCancelDetail from "./components/sip/PauseCancelDetail";
import Otp from "./components/sip/Otp";
import Request from "./components/sip/Request";
import PauseResumeRestart from "./components/sip/PauseResumeRestart";
import SwitchedTransaction from "./components/SwitchedTransaction";
import InvestMore from "./components/InvestMore";

const theme = createMuiTheme(themeConfig);

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f",
});

const jss = create(jssPreset());

const Reports = (props) => {
  const { url } = props.match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
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
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Reports;
