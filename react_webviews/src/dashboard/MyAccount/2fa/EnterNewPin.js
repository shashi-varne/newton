import "./commonStyles.scss";
import React, { useState } from 'react';
import { verifyPin } from '../../../2fa/common/ApiCalls';
import EnterMPin from "../../../2fa/components/EnterMPin";
import Container from "../../common/Container";
import { navigate as navigateFunc } from "../../../utils/functions";

const EnterNewPin = (props) => {
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
      setIsApiRunning("button");
      await verifyPin({
        validate_only: true,
        mpin: pin
      });
      setIsApiRunning(false);
      let params = {};
      if (routeParams.reset_flow) {
        params = { old_mpin: routeParams.old_mpin, new_mpin: pin }
      }
      else {
        params = { reset_url: routeParams.reset_url }
      }
      navigate("confirm-pin", {
        params: params
      })
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
      disable={pin?.length !== 4}
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