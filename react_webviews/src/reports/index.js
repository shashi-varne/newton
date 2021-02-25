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
          <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Reports;
