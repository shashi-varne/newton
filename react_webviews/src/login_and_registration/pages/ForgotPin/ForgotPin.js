import '../Login/commonStyles.scss';
import React from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import WVButton from '../../../common/ui/Button/WVButton';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';

const ForgotPin = (props) => {
  const navigate = navigateFunc.bind(props);

  const handleClick = () => {
    navigate('forgot-pin/verify-otp');
  }

  return (
    <>
      <ForgotMPin />
      <LoginButton onClick={handleClick}>
        Continue
      </LoginButton>
      <WVButton
        color="secondary"
        classes={{ root: 'go-back-to-login' }}
        onClick={() => navigate('/login')}
      >
        Go Back to Login
      </WVButton>
    </>
  );
}

export default ForgotPin;