import '../Login/commonStyles.scss';
import React, { useEffect, useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import WVButton from '../../../common/ui/Button/WVButton';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { forgotPinOtpTrigger, obscuredAuthGetter } from '../../../2fa/common/ApiCalls';

const ForgotPin = (props) => {
  const [authDetails, setAuthDetails] = useState({});
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const handlePanInput = (value) => {
    setPan(value);
  }

  const fetchAuthDetails = async () => {
    try {
      const response = await obscuredAuthGetter();
      setAuthDetails(response);
    } catch(err) {
      console.log(err);
    }
  }

  const handleClick = async () => {
    try {
      const response = {
        "resend_url": "{{plutus_url}}/api/iam/mpin/v2/otp/resend/{{session_id}}",
        "verify_url": "{{plutus_url}}/api/iam/mpin/v2/otp/verify/{{session_id}}",
        "obscured_auth": "du******@yo*********",
        "obscured_auth_type": "own"
      }
      // setIsApiRunning(true);
      // const response = await forgotPinOtpTrigger(pan ? { pan } : '');
      // setIsApiRunning(false);
      navigate('forgot-pin/verify-otp', {
        params: response
      });
    } catch(err) {
      console.log(err);
      setPanError(err);
    } finally {
      setIsApiRunning(false);
    }
  }

  useEffect(() => {
    fetchAuthDetails();
  }, []);

  return (
    <>
      <ForgotMPin
        primaryAuthType={authDetails.obscured_auth_type === 'mobile' ? 'mobile' : 'email'}
        primaryAuthValue={authDetails.obscured_auth}
        isPanRequired={authDetails.is_pan_verified}
        pan={pan}
        panError={panError}
        onPanInputChange={handlePanInput}
      />
      <LoginButton onClick={handleClick} showLoader={isApiRunning}>
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