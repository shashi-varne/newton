import "./commonStyles.scss";
import React, { useState } from 'react';
import { verifyPin } from '../../../2fa/common/ApiCalls';
import EnterMPin from "../../../2fa/components/EnterMPin";
import Container from "../../common/Container";
import { navigate as navigateFunc } from "../../../utils/functions";

const EnterNewPin = (props) => {
  const routeParams = props.location?.params || {}; console.log(routeParams, 'step 2')
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
      navigate('confirm-reset-pin', {
        params: { reset_url: routeParams.reset_url }
      });
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };


  return (
    <Container
      data-aid='my-account-screen'
      showLoader={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={pin?.length === 4 ? false : true}
    >
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
    </Container>
  )
};

export default EnterNewPin;