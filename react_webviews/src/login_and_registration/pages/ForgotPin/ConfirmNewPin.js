import React, { useState } from 'react';
import { twofaPostApi } from '../../../2fa/common/ApiCalls';
import EnterMPin from '../../../2fa/components/EnterMPin';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { nativeCallback } from "../../../utils/native_callback";

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
      setIsApiRunning("button");
      await twofaPostApi(routeParams?.reset_url, { new_mpin: pin });
      setIsApiRunning(false);
      sendEvents("next")
      clearRouteParams();
      navigate('success');
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": 'confirm_fisdom_pin',
        "enable_biometrics": "no",
        "journey": routeParams.set_flow ? "set_fisdom_pin" : "reset_fisdom_pin",
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

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