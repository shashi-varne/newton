import "./LoginContainer.scss";
import React from "react";
import { getConfig } from "utils/functions";
import { Route, Switch } from "react-router-dom";
import PinChangeSuccess from "../ForgotPin/ForgotPinSuccess";
import Login from "./Login";
import VerifyLoginOtp from "./VerifyLoginOtp";
import VerifyPin from "./VerifyPin";
import Referral from "../Referral/Referral";
import { FISDOM_DISCLAMER } from "./constants";
import VerifyForgotOtp from "../ForgotPin/VerifyForgotOtp";
import EnterNewPin from "../ForgotPin/EnterNewPin";
import ConfirmNewPin from "../ForgotPin/ConfirmNewPin";
import ForgotPinSuccess from "../ForgotPin/ForgotPinSuccess";
import ForgotPin from "../ForgotPin/ForgotPin";

const config = getConfig();
const { productName } = config;

const LoginContainer = (props) => {
  const { url } = props.match;
  const pathName = url.split('/')[1];
  console.log(pathName);

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
            {pathName === 'login' &&
              <>
                <Route path={`${url}`} exact component={Login} />
                <Route path={`${url}/pin-change-success`} component={PinChangeSuccess} />
                <Route path={`${url}/verify-otp`} component={VerifyLoginOtp} />
                <Route path={`${url}/verify-pin`} component={VerifyPin} />
                <Route path={`${url}/referral`} component={Referral} />
              </>
            }
            {pathName === 'forgot-pin' &&
              <>
                <Route path={`${url}`} exact component={ForgotPin} />
                <Route path={`${url}/verify-otp`} component={VerifyForgotOtp} />
                <Route path={`${url}/new-pin`} component={EnterNewPin} />
                <Route path={`${url}/confirm-pin`} component={ConfirmNewPin} />
                <Route path={`${url}/success`} component={ForgotPinSuccess} />
              </>
            }
          </Switch>
        </div>
      </div>
      <FooterTitle/>
    </div>
  );
}

export default LoginContainer;

const FooterTitle = () => {
  return (
    <div className="login-footer">
      {FISDOM_DISCLAMER.map((item) => (
        <>
          {item.src ? <img src={require(`assets/${productName}/${item.src}`)} alt="logo" className="brand-logo" /> :
            <div className="title-text">
              {item.key}{" "}-{" "}
              <strong>{item.value}</strong>
            </div>}
        </>
      ))}
    </div>
  );
};