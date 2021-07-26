import '../Login/commonStyles.scss';
import React, { useEffect, useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import WVButton from '../../../common/ui/Button/WVButton';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { forgotPinOtpTrigger, obscuredAuthGetter } from '../../../2fa/common/ApiCalls';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';

const ForgotPin = (props) => {
  const [authDetails, setAuthDetails] = useState({});
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isFetchApiRunning, setIsFetchApiRunning] = useState(false);
  const { clearRouteParams, persistRouteParams } = usePersistRouteParams();
  const navigate = navigateFunc.bind(props);

  const handlePanInput = (value) => {
    setPan(value);
  }

  const fetchAuthDetails = async () => {
    try {
      setIsFetchApiRunning(true);
      const response = await obscuredAuthGetter();
      setAuthDetails(response);
    } catch(err) {
      console.log(err);
    } finally {
      setIsFetchApiRunning(false);
    }
  }

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      const response = await forgotPinOtpTrigger(pan ? { pan } : '');
      setIsApiRunning(false);
      persistRouteParams(response);
      navigate('forgot-pin/verify-otp');
    } catch(err) {
      console.log(err);
      setPanError(err);
    } finally {
      setIsApiRunning(false);
    }
  }

  useEffect(() => {
    clearRouteParams();
    fetchAuthDetails();
  }, []);
  
  return (
    <>
      <ForgotMPin
        primaryAuthType={authDetails.obscured_auth_type === 'mobile' ? 'mobile' : 'email'}
        primaryAuthValue={authDetails.obscured_auth}
        isLoading={isFetchApiRunning}
        isPanRequired={authDetails.is_pan_verified}
        pan={pan}
        panError={panError}
        onPanInputChange={handlePanInput}
      />
      {!isFetchApiRunning &&
        <>
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
      }
    </>
  );
}

export default ForgotPin;