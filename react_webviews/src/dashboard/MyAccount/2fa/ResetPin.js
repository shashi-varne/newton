import "./commonStyles.scss";
import React, { useState } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import TwoFaCtaButton from "./common/TwoFaCtaButton";
import { navigate as navigateFunc } from "../../../utils/functions";

const ResetPin = (props) => {
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
      noFooter={true}
    >
      <EnterMPin
        title="Enter new fisdom PIN"
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
      <TwoFaCtaButton
        onClick={handleClick}
        // disabled={!otp}
        showLoader={isApiRunning}
        className="two-fa-cta-btn"
      >
        Continue
     </TwoFaCtaButton>
    </Container>
  )
};

export default ResetPin;