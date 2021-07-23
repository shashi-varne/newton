import '../Login/commonStyles.scss'; //TODO: figure out proper path for this
import React, { useState } from 'react';
import OtpContainer from '../../../common/components/OtpContainer';
import WVButton from '../../../common/ui/Button/WVButton';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import Toast from 'common/ui/Toast';
import { otpApiCall } from '../../../2fa/common/ApiCalls';

const VerifyForgotOtp = (props) => {
  const routeParams = props.location.params || {};
  // TODO: handle direct landing on this page gracefully => routeParams is empty
  const authType = routeParams.obscured_auth_type === 'mobile' ? 'mobile' : 'email';
  const authValue = routeParams.obscured_auth;
  const otpData = {
    totalTime: 15,
    timeAvailable: 15,
  };
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isResendApiRunning, setIsResendApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const handleOtp = (value) => {
    setOtp(otp);
  }

  const handleResendOtp = async () => {
    try {
      setIsResendApiRunning(true);
      await otpApiCall(routeParams?.resend_url);
    } catch(err) {
      console.log(err);
      Toast(err);
    } finally {
      setIsResendApiRunning(false);
    }
  }

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      const result = await otpApiCall(routeParams?.verify_url, otp);
      setIsApiRunning(false);
      navigate('new-pin', {
        params: { modify_url: result.modify_url }
      });
    } catch(err) {
      console.log(err);
      setOtpError(err);
    } finally {
      setIsApiRunning(false);
    }
  }

  
  return (
    <OtpContainer
      title={`Enter OTP to verify your ${authType === "email" ? "email" : "number"}`}
      otpData={{ ...otpData, otp }}
      showDotLoader={isResendApiRunning}
      handleOtp={handleOtp}
      resendOtp={handleResendOtp}
      isWrongOtp={!!otpError}
      value={authValue}
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