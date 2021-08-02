// -------------- Assets ---------------
import fisdomLogo from 'assets/fisdom/fisdom_logo.svg';
import bgWaves from 'assets/bg_waves.svg';
import HelpPage from '../mini-components/Help';
import ForgotPasswordPage from '../mini-components/ForgotPassword';
// -------------------------------------
import React, { memo, useState } from 'react';
import LoginFields from '../../common/responsive-components/LoginFields';
import { navigate as navigateFunc } from '../common/commonFunctions';
import { WhiteButton } from '../common/Button';
import IwdPhoneInput from '../common/IwdPhoneInput';
import IwdOtpInput from '../common/IwdOtpInput';
import { Button } from 'material-ui';
import { CSSTransition } from 'react-transition-group';
import { nativeCallback } from 'utils/native_callback';

const Login = (props) => {
  const [openHelpPage, toggleHelpPage] = useState(false);
  const [openForgotPwd, toggleForgotPwd] = useState(false);
  const navigate = navigateFunc.bind(props);

  const onLoginSuccess = async (res) => {
    navigate('main/dashboard');
    sendEvents('login', {
      screen_name: 'login',
      status: 'success',
      user_id: res.user.user_id,
    });
  };

  const sendEvents = (user_action, props) => {
    let eventObj = {
      "event_name": 'internal dashboard hni',
      "properties": {
        "user_action": user_action,
        ...props,
      }
    };
    nativeCallback({ events: eventObj });
  };

  return (
    <>
      {/* {openForgotPwd && <ForgotPasswordPage onClose={() => toggleForgotPwd(false)} />} */}
      <CSSTransition
        in={openForgotPwd}
        unmountOnExit
        classNames="circularExpand"
        timeout={1000}
        >
        <ForgotPasswordPage onClose={() => toggleForgotPwd(false)} />
      </CSSTransition>
      <CSSTransition
        in={openHelpPage}
        unmountOnExit
        classNames="circularExpand"
        timeout={1000}
        >
        <HelpPage className={`circularExpand`} onClose={() => toggleHelpPage(false)}/>
      </CSSTransition>
      <div
        id="iwd-login"
        className={(openHelpPage || openForgotPwd) ? 'iwd-bg-fixed' : ''}
      >
        <div id="iwd-login-left">
          <img src={fisdomLogo} alt="fisdom" height="40" />
          <div id="iwd-ll-hero-text">
            Welcome to your <br /><b>investment dashboard</b>
          </div>
          <div id="iwd-ll-divider"></div>
          <div id="iwd-ll-subtext">
            Keep an eye on your money and help it grow
          </div>
          <Button
            variant="raised"
            classes={{
              root: 'iwd-help-btn iwd-ll-help',
              label: 'iwd-help-btn-label',
            }}
            onClick={() => toggleHelpPage(true)}
          >
            Help
          </Button>
        </div>
        <div id="iwd-login-right">
          <div id="iwd-ll-login-container">
            <LoginFields
              phoneComponent={<IwdPhoneInput containerClass="iwd-fade" dropdownClass="iwd-phone-input-dropdown" />}
              otpComponent={<IwdOtpInput />}
              buttonComponent={<WhiteButton classes={{ root: 'iwd-fade' }} />}
              navigateFunction={navigate}
              emailFieldClasses={{
                root: 'iwd-text-field',
                input: 'iwd-text-field-input',
              }}
              onLoginSuccess={onLoginSuccess}
              onForgotPasswordClicked={() => toggleForgotPwd(true)}
              parentProps={props}
            />
          </div>
          <Button
            variant="raised"
            classes={{
              root: 'iwd-help-btn iwd-lr-help',
              label: 'iwd-help-btn-label',
            }}
            onClick={() => toggleHelpPage(true)}
          >
            Help
          </Button>
          <img src={bgWaves} alt="waves_bg" />
        </div>
      </div>
    </>
  );
}

export default memo(Login);