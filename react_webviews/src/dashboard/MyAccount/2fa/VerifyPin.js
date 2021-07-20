import "./commonStyles.scss";
import React, { useState } from 'react';
import WVClickableTextElement from "common/ui/ClickableTextElement/WVClickableTextElement"
import Container from "../../common/Container";
import VerifyMPin from "../../../2fa/components/VerifyMPin";
import { navigate as navigateFunc } from "../../../utils/functions";

const VerifyPin = (props) => {
  const navigate = navigateFunc.bind(props);
  const [showLoader, setShowLoader] = useState(false);
  const [otp, setOtp] = useState('');

  const handleClick = (route) => {
    // Call Verify API 
  };


  const handleOtp = (otp) => {
    setOtp(otp);
  };


  return (
    <Container
      data-aid='my-account-screen'
      noFooter={true}
      skelton={showLoader}
      handleClick={handleClick}
    > 
      <VerifyMPin
        otpProps={{
          handleChange: handleOtp,
          otp,
          // isDisabled:,
          // hasError:,
          // bottomText: "Enter Fisdom PIN"
        }}
      />
      <WVClickableTextElement onClick={() => navigate("/forgot-fisdom-pin")}>
        <p className="clickable-text-ele">FORGOT PIN?</p>
      </WVClickableTextElement>
    </Container>
  )
};

export default VerifyPin;