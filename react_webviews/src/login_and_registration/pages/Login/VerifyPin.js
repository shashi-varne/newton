import './commonStyles.scss';
import React, { useEffect, useState } from 'react';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { Imgc } from '../../../common/ui/Imgc';
import { storageService } from '../../../utils/validators';
import WVClickableTextElement from '../../../common/ui/ClickableTextElement/WVClickableTextElement';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { verifyPin } from '../../../2fa/common/ApiCalls';

const VerifyPin = (props) => {
  const { name } = storageService().getObject('user') || {};
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const onOtpChange = (val) => {
    setMpin(val);
  }

  useEffect(() => {
    if (mpin.length === 4) {
      handleClick();
    }
  }, [mpin])

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await verifyPin({ mpin });
    } catch(err) {
      console.log(err);
      setMpinError(err);
    } finally {
      setIsApiRunning(false);
    }
  }

  return (
    <div className="login-verify-pin">
      <EnterMPin
        otpProps={{
          otp: mpin,
          handleOtp: onOtpChange,
          hasError: !!mpinError,
          bottomText: mpinError || 'Enter Fisdom PIN'
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
      <LoginButton showLoader={isApiRunning} onClick={handleClick}>Continue</LoginButton>
      {/* TODO: Check with Design team ^ */}
      <div className="lvp-footer">
        <WVClickableTextElement onClick={() => navigate('/login')}>
          Switch Account
        </WVClickableTextElement>
        <WVClickableTextElement onClick={() => navigate('/forgot-pin')}>
          Forgot PIN?
        </WVClickableTextElement>
      </div>
    </div>
  );
}

export default VerifyPin;