import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

import "./components/Style.scss";
import NotFound from "../common/components/NotFound";

import WhastappConfirmNumber from "./components/whatsapp_confirm";
import WhatsappEdit from "./components/whatsapp_edit";
import WhatsappOtpVerification from "./components/otp_verify";
import WhatsappOtpSuccess from "./components/otp_success";

const Whatsapp = (props) => {
  const { url } = props.match;

  return (
     <Fragment>
        <Switch>

            <Route path={`${url}/mobile-verify`} component={WhastappConfirmNumber} />
            <Route path={`${url}/edit-number`} component={WhatsappEdit} />
            <Route path={`${url}/otp-verify`} component={WhatsappOtpVerification} />
            <Route path={`${url}/otp-success`} component={WhatsappOtpSuccess} />
            <Route component={NotFound} />
        </Switch>
      </Fragment>
  );
};

export default Whatsapp;