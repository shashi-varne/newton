import React from 'react';
import MPinChangeSuccess from '../../../2fa/components/MPinChangeSuccess';
import { navigate as navigateFunc } from "utils/functions";
import LoginButton from '../../common/LoginButton';


const ForgotPinSuccess = (props) => {
  const navigate = navigateFunc.bind(props);

  return (
    <>
      <MPinChangeSuccess>
        <LoginButton onClick={() => navigate("/login")}>
          Log in again
        </LoginButton>
      </MPinChangeSuccess>
    </>
  );
}

export default ForgotPinSuccess;