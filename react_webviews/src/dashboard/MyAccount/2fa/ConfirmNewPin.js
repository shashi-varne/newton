import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { modifyPin } from '../../../2fa/common/ApiCalls';

import { navigate as navigateFunc } from "../../../utils/functions";

const ConfirmNewPin = (props) => {
  const routeParams = props.location?.params || {};
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await modifyPin({ new_mpin: pin, old_mpin: routeParams?.old_mpin });
      setIsApiRunning(false);
      navigate('security-settings');
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };


  const handlePin = (value) => {
    setPin(value);
    setPinError('');
  }


  return (
    <Container
      data-aid='my-account-screen'
      skelton={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={pin?.length !== 4}
    >
      <EnterMPin
        title="Confirm fisdom PIN"
        subtitle="Ensuring maximum security for your investment account"
        showLoader={isApiRunning}
        otpProps={{
          otp: pin,
          handleOtp: handlePin,
          hasError: !!pinError,
          bottomText: pinError || '',
        }}
      />
    </Container>
  )
};

export default ConfirmNewPin;