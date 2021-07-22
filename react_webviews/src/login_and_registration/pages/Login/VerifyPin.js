import './commonStyles.scss';
import React, { useState } from 'react';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from '../../../utils/validators';
import WVClickableTextElement from '../../../common/ui/ClickableTextElement/WVClickableTextElement';

const VerifyPin = () => {
  const { name } = storageService().getObject('user') || {};
  const [otpError, setOtpError] = useState(false);
  const [otp, setOtp] = useState('');

  const onOtpChange = (val) => {
    console.log(val);
  }

  return (
    <div className="login-verify-pin">
      <EnterMPin
        otpProps={{
          otp,
          handleOtp: onOtpChange,
          hasError: otpError,
          bottomText: otpError ? '' : 'Enter Fisdom PIN'
        }}
      >
        <Imgc
          src={require(`assets/padlock1.svg`)}
          alt=""
          style={{ height: '20px', width: '20px', marginBottom: '10px' }}
        />
        <EnterMPin.Title className="lvp-title">
          Welcome back,
        </EnterMPin.Title>
        <EnterMPin.Subtitle className="lvp-username">
          {name}
        </EnterMPin.Subtitle>
      </EnterMPin>
      <div className="lvp-footer">
        <WVClickableTextElement>
          Switch Account
        </WVClickableTextElement>
        <WVClickableTextElement>
          Forgot PIN?
        </WVClickableTextElement>
      </div>
    </div>
  );
}

export default VerifyPin;