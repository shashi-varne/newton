import React, { useState } from 'react';
import { twofaPostApi } from '../../../2fa/common/ApiCalls';
import EnterMPin from '../../../2fa/components/EnterMPin';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';

const ConfirmNewPin = (props) => {
  const { routeParams, clearRouteParams } = usePersistRouteParams();
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const handlePin = (value) => {
    setPin(value);
    setPinError('');
  }

  const validatePin = () => {
    if (routeParams?.newPin !== pin) {
      // eslint-disable-next-line no-throw-literal
      throw "PIN doesn’t match, Please try again";
    }
    return true;
  }

  const handleClick = async () => {
    try {
      validatePin();

      setIsApiRunning(true);
      await twofaPostApi(routeParams?.reset_url, { new_mpin: pin });
      setIsApiRunning(false);

      clearRouteParams();
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