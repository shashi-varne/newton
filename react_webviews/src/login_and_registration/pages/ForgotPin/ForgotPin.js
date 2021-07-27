import '../Login/commonStyles.scss';
import React, { useEffect, useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { forgotPinOtpTrigger, obscuredAuthGetter } from '../../../2fa/common/ApiCalls';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import GoBackToLoginBtn from '../../common/GoBackToLoginBtn';
import SessionExpiredUi from '../../components/SessionExpiredUi';

const ForgotPin = (props) => {
  const [authDetails, setAuthDetails] = useState({});
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [fetchError, setFetchError] = useState(false);
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
      setFetchError(true);
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
        noData={fetchError}
        renderNoData={<SessionExpiredUi navigateFunc={navigate} />}
      />
      {!isFetchApiRunning && !fetchError &&
        <>
          <LoginButton onClick={handleClick} showLoader={isApiRunning}>
            Continue
          </LoginButton>
          <GoBackToLoginBtn navigateFunc={navigate} />
        </>
      }
    </>
  );
}

export default ForgotPin;