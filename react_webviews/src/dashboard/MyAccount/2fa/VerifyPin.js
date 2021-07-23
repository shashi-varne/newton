import "./commonStyles.scss";
import React, { useState } from 'react';
import WVClickableTextElement from "common/ui/ClickableTextElement/WVClickableTextElement"
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { Imgc } from "../../../common/ui/Imgc";
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
      showLoader={showLoader}
      handleClick={handleClick}
      noFooter={true}
      hideInPageTitle
      hidePageTitle
    >
      <EnterMPin
        otpProps={{
          handleChange: handleOtp,
          otp,
          // isDisabled:,
          // hasError:,
          bottomText: "Enter Fisdom PIN"
        }}
      >
        <Imgc
          src={require(`assets/padlock1.svg`)}
          alt=""
          style={{ height: '20px', width: '20px', marginBottom: '20px' }}
        />
        <EnterMPin.Title style={{ marginBottom: '75px' }}>
          Enter your current fisdom PIN
        </EnterMPin.Title>
      </EnterMPin>
      <WVClickableTextElement onClick={() => navigate("/forgot-fisdom-pin")}>
        <p className="clickable-text-ele">FORGOT PIN?</p>
      </WVClickableTextElement>
    </Container>
  )
};

export default VerifyPin;