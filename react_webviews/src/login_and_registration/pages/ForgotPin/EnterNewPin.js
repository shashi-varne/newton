import React, { useState } from 'react';
import { verifyPin } from '../../../2fa/common/ApiCalls';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';

const EnterNewPin = (props) => {
  const routeParams = props.location?.params || {};
  console.log(routeParams);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  
  const navigate = navigateFunc.bind(props);

  const handlePin = (value) => {
    setPin(value);
    setPinError('');
  }

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await verifyPin({
        validate_only: true,
        mpin: pin
      });
      setIsApiRunning(false);
      navigate('confirm-pin', {
        params: { reset_url: routeParams.reset_url }
      });
    } catch(err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  return (
    <>
      <EnterMPin
        title="Enter new fisdom PIN"
        subtitle="Keep your account safe and secure"
        otpProps={{
          otp: pin,
          handleOtp: handlePin,
          hasError: !!pinError,
          bottomText: pinError || '',
        }}
      />
      <LoginButton
        onClick={handleClick}
        disabled={pin.length !== 4}
        showLoader={isApiRunning}
      >
        Continue
      </LoginButton>
    </>
  );
}

export default EnterNewPin;