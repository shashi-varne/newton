import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";

import { navigate as navigateFunc } from "../../../utils/functions";

const confirmResetPin = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [otp, setOtp] = useState('');

  const handleClick = (route) => {

  };


  const handleOtp = (otp) => {
    setOtp(otp);
  };


  return (
    <Container
      data-aid='my-account-screen'
      skelton={showLoader}
      handleClick={handleClick}
      buttonTitle="Continue"
    >
      <EnterMPin
        title="Confirm fisdom PIN"
        subtitle="Keep your account safe and secure"
        showLoader={isApiRunning}
        otpProps={{
          handleChange: handleOtp,
          otp,
          // isDisabled:,
          // hasError:,
          bottomText: ""
        }}
      />
    </Container>
  )
};

export default confirmResetPin;