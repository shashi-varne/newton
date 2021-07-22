import '../Login/commonStyles.scss'; //TODO: figure out proper path for this
import React, { useState } from 'react';
import OtpContainer from '../../../common/components/OtpContainer';
import WVButton from '../../../common/ui/Button/WVButton';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';

const VerifyForgotOtp = (props) => {
  const communicationType = ''; //TODO: change name
  const communicationValue = '';
  const otpData = {
    totalTime: 15,
    timeAvailable: 15,
  };
  const [isWrongOtp, setIsWrongOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isApiRunning, setIsApiRunning] = useState('');

  const navigate = navigateFunc.bind(props);

  const handleOtp = (value) => {
    setOtp(otp);
  }

  const handleResendOtp = () => {
    // Call Resend API here
  }

  const handleClick = () => {
    navigate('new-pin');
    // Call Verify API here
  }

  
  return (
    <OtpContainer
      title={`Enter OTP to verify your ${communicationType === "email" ? "email" : "number"}`}
      otpData={{ ...otpData, otp }}
      // showDotLoader={showDotLoader}
      handleOtp={handleOtp}
      resendOtp={handleResendOtp}
      isWrongOtp={isWrongOtp}
      value={communicationValue}
      classes={{
        subtitle: "login-subtitle"
      }}
    >
      <LoginButton
        onClick={handleClick}
        // disabled={!otp}
        showLoader={isApiRunning}
      >
        CONTINUE
      </LoginButton>
      <WVButton
        color="secondary"
        classes={{ root: 'go-back-to-login' }}
        onClick={() => navigate('/login')}
      >
        Go Back to Login
      </WVButton>
    </OtpContainer>
  );
}

export default VerifyForgotOtp;