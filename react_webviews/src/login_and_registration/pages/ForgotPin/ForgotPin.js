import '../Login/commonStyles.scss';
import React, { useEffect, useState } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import WVButton from '../../../common/ui/Button/WVButton';
import { navigate as navigateFunc } from '../../../utils/functions';
import LoginButton from '../../common/LoginButton';
import { nativeCallback } from "../../../utils/native_callback";
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
      sendEvents("next")
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

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": 'forgot_pin',
        "correct_details_entered": panError ? "no" : "yes",
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const goBack = () => {
    navigate('/login');
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
      />
      {!isFetchApiRunning &&
        <>
          <LoginButton onClick={handleClick} showLoader={isApiRunning}>
            Continue
          </LoginButton>
          <WVButton
            color="secondary"
            classes={{ root: 'go-back-to-login' }}
            onClick={goBack}
          >
            Go Back to Login
          </WVButton>
        </>
      }
    </>
  );
}

export default ForgotPin;