import React from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import WVButton from '../../../common/ui/Button/WVButton';
import WVClickableTextElement from '../../../common/ui/ClickableTextElement/WVClickableTextElement';

const ForgotPin = () => {
  return (
    <>
      <ForgotMPin />
      <WVButton contained color="secondary">
        Continue
      </WVButton>
      <WVClickableTextElement style={{ fontWeight: '300' }}>
        Go back to login
      </WVClickableTextElement>
    </>
  );
}

export default ForgotPin;