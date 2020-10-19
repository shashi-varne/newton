import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import "../common/theme/Style.scss";
import { themeConfig } from "utils/constants";
import { ToastContainer } from "react-toastify";

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";

import WhastappConfirmNumber from "./components/whatsapp_confirm";
import WhatsappEdit from "./components/whatsapp_edit";
import WhatsappOtpVerification from "./components/otp_verify";
import WhatsappOtpSuccess from "./components/otp_success";

import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
  productionPrefix: "f",
});
const jss = create(jssPreset());

const theme = createMuiTheme(themeConfig);

const ScrollToTop = withRouter(
  class ScrollToTopWithoutRouter extends Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
    }

    render() {
      return null;
    }
  }
);

const Whatsapp = (props) => {
  const { url } = props.match;

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <ScrollToTop />
        <ToastContainer autoClose={3000} />
        <Switch>

            <Route path={`${url}/whatsapp-confirm`} component={WhastappConfirmNumber} />
            <Route path={`${url}/whatsapp-edit`} component={WhatsappEdit} />
            <Route path={`${url}/otp-verify`} component={WhatsappOtpVerification} />
            <Route path={`${url}/otp-success`} component={WhatsappOtpSuccess} />
            <Route component={NotFound} />
        </Switch>
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default Whatsapp;