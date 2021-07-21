import React, { useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import Container from '../../common/Container';

const ForgotPin = (props) => {
  const stateParams = props.history.match;
  const [showLoader, setShowLoader] = useState(false);
  
  const handleClick = () => {
    // Call API here
  }

  return (
    <Container
      data-aid='myaccount-forgot-pin'
      title="Forgot Fisdom PIN"
      fullWidthButton
      skelton={showLoader}
      buttonTitle="CONTINUE"
      handleClick={handleClick}
    >
      <ForgotMPin
        primaryAuthType={stateParams?.authType}
        primaryAuthValue={stateParams?.authValue}
        isPANRequired={stateParams?.isPanRequired}
        // PANError={}
      />
    </Container>
  );
}

export default ForgotPin;