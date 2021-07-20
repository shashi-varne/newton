import React from 'react';
import MPinChangeSuccess from '../../../2fa/components/MPinChangeSuccess';
import WVButton from 'common/ui/Button/WVButton';
import { getConfig, navigate as navigateFunc } from "utils/functions";

const config = getConfig();
const isMobileView = config.isMobileDevice;

const PinChangeSuccess = () => {
  const navigate = navigateFunc.bind(this);

  return (
    <>
      <MPinChangeSuccess/>
      <WVButton
        variant='contained'
        size='large'
        color="secondary"
        onClick={() => navigate("/login")}
        disabled={false}
        showLoader={false}
        fullWidth
        className={isMobileView ? "login-otp-button login-otp-button-mobile" : "login-otp-button login-otp-button-web"}
      >
        LOG IN again
      </WVButton>
    </>
  );
}

export default PinChangeSuccess;