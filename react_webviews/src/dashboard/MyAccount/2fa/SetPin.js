import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { verifyPin } from '../../../2fa/common/ApiCalls';
import { navigate as navigateFunc } from "../../../utils/functions";

const SetPin = (props) => {
  const navigate = navigateFunc.bind(props);
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);


  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      await verifyPin({
        validate_only: true,
        mpin: mpin
      }); // TODO  Api Throwing 500 Error Hve to Look Into this!~
      navigate('confirm-pin', {
        params: { new_mpin: mpin, set_flow: true }
      });
    } catch (err) {
      console.log(err);
      setMpinError(err);
    } finally {
      setIsApiRunning(false);
    }
  }


  const onPinChange = (val) => {
    setMpin(val);
    setMpinError('')
  }


  return (
    <Container
      data-aid='my-account-screen'
      showLoader={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={mpin?.length !== 4}
      fullWidthButton
    >
      <EnterMPin
        title="Set fisdom PIN"
        subtitle="Ensuring maximum security for your investment account"
        otpProps={{
          otp: mpin,
          handleOtp: onPinChange,
          hasError: !!mpinError,
          bottomText: mpinError || '',
        }}
      />
    </Container>
  )
};

export default SetPin;