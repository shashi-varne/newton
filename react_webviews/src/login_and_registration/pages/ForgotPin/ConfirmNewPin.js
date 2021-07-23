import React, { useState } from 'react';
import { twofaPostApi } from '../../../2fa/common/ApiCalls';
import EnterMPin from '../../../2fa/components/EnterMPin';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';

const ConfirmNewPin = (props) => {
  const routeParams = props.location?.params || {};
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
      await twofaPostApi(routeParams?.reset_url, { new_mpin: pin });
      setIsApiRunning(false);
      navigate('success');
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  return (
    <>
      <EnterMPin
        title="Confirm fisdom PIN"
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

export default ConfirmNewPin;