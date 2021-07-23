import './LoginButton.scss';
import React from 'react';
import WVButton from '../../common/ui/Button/WVButton';

const LoginButton = ({ children, ...props }) => {
  return (
    <WVButton
      contained
      fullWidth
      color="secondary"
      classes={{ root: "login-button" }}
      {...props}
    >
      {children}
    </WVButton>
  );
}

export default LoginButton;