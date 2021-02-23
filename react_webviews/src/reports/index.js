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
import Summary from "./components/Summary";
import { themeConfig } from "utils/constants";
import "./Style.scss";

const theme = createMuiTheme(themeConfig);

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f",
});

const jss = create(jssPreset());

const FundInfo = (props) => {
  const { url } = props.match;
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ToastContainer autoClose={3000} />
        <Switch>
          <Route path={url} exact component={Summary} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default FundInfo;
