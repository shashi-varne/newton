import './TwoFaCtaButton.scss';
import React from 'react';
import WVButton from '../../../../common/ui/Button/WVButton'

const LoginButton = ({ children, ...props }) => {
  return (
    <WVButton
      contained
      fullWidth
      color="secondary"
      classes={{ root: "two-fa-cta-btn" }}
      {...props}
    >
      {children}
    </WVButton>
  );
}

export default LoginButton;