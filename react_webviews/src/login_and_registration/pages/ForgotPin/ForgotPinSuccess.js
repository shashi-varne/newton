import React from 'react';
import MPinChangeSuccess from '../../../2fa/components/MPinChangeSuccess';
import { getConfig, navigate as navigateFunc } from "utils/functions";
import LoginButton from '../../common/LoginButton';

const ForgotPinSuccess = (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = getConfig();

  return (
    <>
      <MPinChangeSuccess productName={productName}>
        <LoginButton onClick={() => navigate("/login")}>
          Log in again
        </LoginButton>
      </MPinChangeSuccess>
    </>
  );
}

export default ForgotPinSuccess;