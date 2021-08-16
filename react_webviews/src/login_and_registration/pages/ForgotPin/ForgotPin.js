import '../Login/commonStyles.scss';
import React, { useEffect, useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { nativeCallback } from "../../../utils/native_callback";
import { forgotPinOtpTrigger, obscuredAuthGetter } from '../../../2fa/common/apiCalls';
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import GoBackToLoginBtn from '../../common/GoBackToLoginBtn';
import SessionExpiredUi from '../../components/SessionExpiredUi';

const ForgotPin = (props) => {
  const [authDetails, setAuthDetails] = useState({});
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [authFetchError, setAuthFetchError] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isFetchApiRunning, setIsFetchApiRunning] = useState(false);
  const [panEntryFailed, setPanEntryFailed] = useState(false);
  const { clearRouteParams, persistRouteParams } = usePersistRouteParams();
  const navigate = navigateFunc.bind(props);
  const config = getConfig();

  const handlePanInput = (value) => {
    setPan(value);
    setPanError('');
  }

  const fetchAuthDetails = async () => {
    try {
      setIsFetchApiRunning(true);
      const response = await obscuredAuthGetter();
      setAuthDetails(response);
    } catch(err) {
      console.log(err);
      setAuthFetchError(true);
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
      sendEvents("next")
      navigate('forgot-pin/verify-otp');
    } catch(err) {
      console.log(err);
      setPanError(err);
      setPanEntryFailed(true);
    } finally {
      setIsApiRunning(false);
    }
  }

  useEffect(() => {
    clearRouteParams();
    fetchAuthDetails();
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": 'forgot_pin',
        "correct_details_entered": panEntryFailed ? "no" : "yes",
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const goBack = () => {
    if (config.isLoggedIn) {
      // Doing this to prevent logout API errors for when no active login session is available
      navigate('/logout');
    } else {
      navigate('/login');
    }
    sendEvents("back");
  }

  
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
        noData={authFetchError}
        renderNoData={<SessionExpiredUi onGoBackClicked={goBack} />}
        productName={config.productName}
      />
      {!isFetchApiRunning && !authFetchError &&
        <>
          <LoginButton
            onClick={handleClick}
            showLoader={isApiRunning}
            disabled={authDetails?.is_pan_verified && !pan}
          >
            Continue
          </LoginButton>
          <GoBackToLoginBtn onClick={goBack} />
        </>
      }
    </>
  );
}

export default ForgotPin;