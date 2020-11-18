import React, { memo, useState } from 'react';
import LoginFields from '../../common/responsive-components/LoginFields';
import { navigate } from '../common/commonFunctions';
import { getConfig } from "utils/functions";
import { WhiteButton } from '../common/Button';
import IwdPhoneInput from '../common/IwdPhoneInput';
import IwdOtpInput from '../common/IwdOtpInput';
import { Button } from 'material-ui';
// ---------- Image Imports ------------
import fisdomLogo from 'assets/fisdom/fisdom_logo_coloured.png';
import bgWaves from 'assets/bg_waves.svg';
import HelpPage from '../mini-components/Help';
// -------------------------------------
const isMobileView = getConfig().isMobileDevice;

const Login = (props) => {
  const [openHelpPage, toggleHelpPage] = useState(false);
  return (
    <>
      <HelpPage className={`circularExpand ${openHelpPage ? 'expand' : 'shrink'}`} onClose={() => toggleHelpPage(false)}/>
      {<div id="iwd-login">
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
              phoneComponent={<IwdPhoneInput containerClass="fade" />}
              otpComponent={<IwdOtpInput />}
              buttonComponent={<WhiteButton classes={{ root: 'fade' }}>Hello</WhiteButton>}
              navigateFunction={navigate.bind(props)}
              emailFieldClasses={{
                root: 'iwd-text-field',
                input: 'iwd-text-field-input',
              }}
              // animation="fade"
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
      }
    </>
  );
}

export default memo(Login);