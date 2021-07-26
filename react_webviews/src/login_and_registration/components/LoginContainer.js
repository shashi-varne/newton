import "./LoginContainer.scss";
import React from "react";
import { getConfig } from "utils/functions";
import { Route, Switch } from "react-router-dom";
import PinChangeSuccess from "../pages/ForgotPin/ForgotPinSuccess";
import Login from "../pages/Login/Login";
import VerifyLoginOtp from "../pages/Login/VerifyLoginOtp";
import VerifyPin from "../pages/Login/VerifyPin";
import Referral from "../pages/Referral/Referral";
import VerifyForgotOtp from "../pages/ForgotPin/VerifyForgotOtp";
import EnterNewPin from "../pages/ForgotPin/EnterNewPin";
import ConfirmNewPin from "../pages/ForgotPin/ConfirmNewPin";
import ForgotPinSuccess from "../pages/ForgotPin/ForgotPinSuccess";
import ForgotPin from "../pages/ForgotPin/ForgotPin";
import SVG from 'react-inlinesvg';

const config = getConfig();
const { productName } = config;

const LoginContainer = (props) => {
  const { url } = props.match;
  const pathName = url.split('/')[1];
  console.log(pathName);

  return (
    <div className="login" data-aid='login'>
      <div className="header">
        {/* TODO: fix logo for header */}
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
      <div className="lf-logos">
        <SVG
          height="20px"
          width="64px"
          preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
          src={require(`assets/${productName}/fisdom_logo_white.svg`)}
        />
        <SVG
          width="20px"
          height="20px"
          preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#2D2D94')}
          src={require(`assets/sebi_logo.svg`)}
        />
      </div>
      <div className="title-text">
        NSE member code - 90228 | BSE member code - 6696 | NSE/BSE - SEBI registration no. - INZ000209036 | CDSL - SEBI registeration no. - IN-DP-572-2021 , INA200005323 | AMFI registration no. ARN 103168
      </div>
    </div>
  );
};