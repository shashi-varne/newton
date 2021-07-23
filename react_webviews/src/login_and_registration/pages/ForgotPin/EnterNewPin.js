import React, { useState } from 'react';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';

const EnterNewPin = (props) => {
  const [otp, setOtp] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    navigate('confirm-pin');
  };

  return (
    <>
      <EnterMPin
        title="Enter new fisdom PIN"
        subtitle="Keep your account safe and secure"
        otpProps={{}}
      />
      <LoginButton
        onClick={handleClick}
        // disabled={!otp}
        showLoader={isApiRunning}
      >
        Continue
      </LoginButton>
    </>
  );
}

export default EnterNewPin;