import "./LoginContainer.scss";
import React from "react";
import { getConfig } from "utils/functions";
import { Route, Switch } from "react-router-dom";
import Login from "../pages/Login/Login";
import VerifyLoginOtp from "../pages/Login/VerifyLoginOtp";
import VerifyPin from "../pages/Login/VerifyPin";
import VerifyForgotOtp from "../pages/ForgotPin/VerifyForgotOtp";
import EnterNewPin from "../pages/ForgotPin/EnterNewPin";
import ConfirmNewPin from "../pages/ForgotPin/ConfirmNewPin";
import ForgotPinSuccess from "../pages/ForgotPin/ForgotPinSuccess";
import ForgotPin from "../pages/ForgotPin/ForgotPin";
import SVG from 'react-inlinesvg';
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import GoBackToLoginBtn from "../common/GoBackToLoginBtn";
import { navigate as navigateFunc } from "../../utils/functions";
import { Imgc } from "../../common/ui/Imgc";

const LoginContainer = (props) => {
  const config = getConfig();
  const { productName } = config;
  const { match: { url }, location } = props;
  const pathName = url.split('/')[1];
  const navigate = navigateFunc.bind(props);

  return (
    <div className="login" data-aid='login'>
      <div className="header">
        <img src={require(`assets/${config.logo}`)} alt="logo" />
      </div>
      <div className="login-details">
        <div className="ld-left">
          <Imgc
            src={require(`assets/${productName}/ils_login.svg`)}
            alt="login"
            style={{ width: '480px', height: '330px' }}
          />
        </div>
        <div className="ld-right ldr-animatedFade" key={location.key}>
          <>
            {pathName === 'login' &&
              <Switch location={location}>
                <Route path={`${url}`} exact component={Login} />
                <Route path={`${url}/verify-otp`} component={VerifyLoginOtp} />
                <Route path={`${url}/verify-pin`} component={VerifyPin} />
                <Route>
                  <PageNotFound navigateFunc={navigate} config={config} />
                </Route>
              </Switch>
            }
            {pathName === 'forgot-pin' &&
              <Switch>
                <Route path={`${url}`} exact component={ForgotPin} />
                <Route path={`${url}/verify-otp`} component={VerifyForgotOtp} />
                <Route path={`${url}/new-pin`} component={EnterNewPin} />
                <Route path={`${url}/confirm-pin`} component={ConfirmNewPin} />
                <Route path={`${url}/success`} component={ForgotPinSuccess} />
                <Route>
                  <PageNotFound navigateFunc={navigate} config={config} />
                </Route>
              </Switch>
            }
          </>
        </div>
      </div>
      <FooterTitle config={config} />
    </div>
  );
}

export default LoginContainer;

const FooterTitle = ({ config }) => {
  return (
    <div className="login-footer">
      <div className="lf-logos">
        <SVG
          height="20px"
          width="64px"
          preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + config.styles.primaryColor)}
          src={require(`assets/${config.logo}`)}
        />
        <SVG
          width="20px"
          height="20px"
          src={require(`assets/sebi_logo.svg`)}
        />
      </div>
      <div className="title-text">
        NSE member code - 90228 | BSE member code - 6696 | NSE/BSE - SEBI registration no. - INZ000209036 | CDSL - SEBI registeration no. - IN-DP-572-2021 , INA200005323 | AMFI registration no. ARN 103168
      </div>
    </div>
  );
};

const PageNotFound = ({ navigateFunc, config }) => {
  return (
    <>
      <WVInPageTitle style={{ textAlign: 'center', marginBottom: '20px' }}>Lost your way?</WVInPageTitle>
      <img
        src={require(`assets/${config.productName}/error_illustration.svg`)}
        style={{ width: '100%' }}
        alt="404"
      />
      <GoBackToLoginBtn onClick={() => navigateFunc('/login')} />
    </>
  );
}