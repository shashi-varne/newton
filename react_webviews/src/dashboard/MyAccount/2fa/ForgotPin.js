import React, { useState, useEffect } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import Container from '../../common/Container';

import { navigate as navigateFunc } from "../../../utils/functions";
import { forgotPinOtpTrigger, obscuredAuthGetter } from '../../../2fa/common/ApiCalls';

const ForgotPin = (props) => {
  const [authDetails, setAuthDetails] = useState({});
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [isFetchApiRunning, setIsFetchApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    fetchAuthDetails();
  }, []);


  const fetchAuthDetails = async () => {
    try {
      setIsFetchApiRunning(true);
      const response = await obscuredAuthGetter();
      setAuthDetails(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetchApiRunning(false);
    }
  }

  const handlePanInput = (value) => {
    setPan(value);
  }

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      const response = await forgotPinOtpTrigger(pan ? { pan } : '');
      setIsApiRunning(false);
      navigate('verify-otp', {
        params: response
      });
    } catch (err) {
      console.log(err);
      setPanError(err);
    } finally {
      setIsApiRunning(false);
    }
  }


  return (
    <Container
      data-aid='myaccount-forgot-pin'
      showLoader={isApiRunning}
      skelton={isFetchApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      hideInPageTitle
      hidePageTitle
    >
      <ForgotMPin
        primaryAuthType={authDetails?.obscured_auth_type === 'mobile' ? 'mobile' : 'email'}
        primaryAuthValue={authDetails?.obscured_auth}
        isLoading={isFetchApiRunning}
        isPanRequired={authDetails?.is_pan_verified}
        pan={pan}
        panError={panError}
        onPanInputChange={handlePanInput}
      />
    </Container>
  );
}

export default ForgotPin;