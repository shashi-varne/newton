import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import { twofaPostApi } from '../../../2fa/common/ApiCalls';
import EnterMPin from "../../../2fa/components/EnterMPin";

import { navigate as navigateFunc } from "../../../utils/functions";

const confirmResetPin = (props) => {
  const routeParams = props.location?.params || {};
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await twofaPostApi(routeParams?.reset_url, { new_mpin: pin });
      setIsApiRunning(false);
      navigate('security-settings');
    } catch (err) {
      console.log(err);
      navigate('security-settings');
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
      showLoader={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={pin?.length === 4 ? false : true}
    >
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
    </Container>
  )
};

export default confirmResetPin;