import './GoBackToLoginBtn.scss';
import React from 'react';
import WVButton from '../../common/ui/Button/WVButton';

export default function GoBackToLoginBtn({
  navigateFunc,
  ...buttonProps
}) {
  return (
    <WVButton
      color="secondary"
      classes={{ root: 'go-back-to-login' }}
      onClick={() => navigateFunc('/login')}
      {...buttonProps}
    >
      Go Back to Login
    </WVButton>
  );
} 