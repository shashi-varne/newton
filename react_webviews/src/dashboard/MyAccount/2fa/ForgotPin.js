import React, { useState, useEffect } from 'react';
import ForgotMPin from '../../../2fa/components/ForgotMPin';
import Container from '../../common/Container';

import { navigate as navigateFunc } from "../../../utils/functions";
import { forgotPinOtpTrigger, obscuredAuthGetter } from '../../../2fa/common/ApiCalls';

const ForgotPin = (props) => {
  const stateParams = props.history.match;
  const [authDetails, setAuthDetails] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    fetchAuthDetails();
  }, []);


  const fetchAuthDetails = async () => {
    try {
      const response = await obscuredAuthGetter();
      setAuthDetails(response);
    } catch(err) {
      console.log(err);
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
      navigate('verify-pin-otp', {
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
      handleClick={handleClick}
      buttonTitle="Continue"
      hideInPageTitle
      hidePageTitle
    >
      <ForgotMPin
        primaryAuthType={stateParams?.authType}
        primaryAuthValue={stateParams?.authValue}
        isPANRequired={stateParams?.isPanRequired}
        pan={pan}
        panError={panError}
        onPanInputChange={handlePanInput}
      />
    </Container>
  );
}

export default ForgotPin;