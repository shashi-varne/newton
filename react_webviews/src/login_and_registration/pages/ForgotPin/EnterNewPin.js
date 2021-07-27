import React, { useEffect, useState } from 'react';
import { verifyPin } from '../../../2fa/common/ApiCalls';
import EnterMPin from '../../../2fa/components/EnterMPin';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { nativeCallback } from "../../../utils/native_callback";

const EnterNewPin = (props) => {
  const { routeParams, persistRouteParams } = usePersistRouteParams();
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
      setIsApiRunning("button");
      await verifyPin({
        validate_only: true,
        mpin: pin
      });
      setIsApiRunning(false);

      persistRouteParams({ ...routeParams, newPin: pin });
      sendEvents("next");
      navigate('confirm-pin');
    } catch(err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  useEffect(() => {
    // TODO: Intercept back click 
    // props.history.listen((location) => {
    //   console.log(props.history);
    // });
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": 'enter_current_pin',
        "enable_biometrics": "no",
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
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