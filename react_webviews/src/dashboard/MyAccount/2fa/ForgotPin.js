import React, { useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import Container from '../../common/Container';
import TwoFaCtaButton from "./common/TwoFaCtaButton";
import { navigate as navigateFunc } from "../../../utils/functions";

const ForgotPin = (props) => {
  const stateParams = props.history.match;
  const [showLoader, setShowLoader] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    navigate("2fa-verify-pin-otp")  // "TODO Path name need to be Re-named"
  }

  return (
    <Container
      data-aid='myaccount-forgot-pin'
      title="Forgot Fisdom PIN"
      skelton={showLoader}
      noFooter={true}
    >
      <ForgotMPin
        primaryAuthType={stateParams?.authType}
        primaryAuthValue={stateParams?.authValue}
        isPANRequired={stateParams?.isPanRequired}
      // PANError={}
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
  );
}

export default ForgotPin;