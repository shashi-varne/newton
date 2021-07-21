import "./loginStyle.scss";
import React from "react";
import { getConfig } from "utils/functions";
import { Route, Switch } from "react-router-dom";
import PinChangeSuccess from "../ForgotPin/PinChangeSuccess";
import Login from "./Login";
import Otp from "./VerifyOtp.js";
import Referral from "../Referral/Referral"

const config = getConfig();
const { productName } = config;

const LoginContainer = (props) => {
  let { url } = props.match;
  console.log(url);
  return (
    <div className="login" data-aid='login'>
      <div className="header">
        <img src={require(`assets/${config.logo}`)} alt="logo" />
      </div>
      <div className="login-details">
        <div className="ld-left">
          <img src={require(`assets/${productName}/ils_login.svg`)} alt="login" />
        </div>
        <div className="ld-right">
          <Switch>
          <Route path={`${url}`} exact component={Login} />
          <Route path={`${url}/pin-change-success`} component={PinChangeSuccess} />
          <Route path={`${url}/referral`} component={Referral} />
          <Route path={`${url}/verify-otp`} component={Otp} />
          <Route path={`${url}/forgot-pin`} component={PinChangeSuccess} />
          <Route path={`${url}/reset-pin`} component={PinChangeSuccess} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default LoginContainer;