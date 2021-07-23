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
      const response = {
        "resend_url": "{{plutus_url}}/api/iam/mpin/v2/otp/resend/{{session_id}}",
        "verify_url": "{{plutus_url}}/api/iam/mpin/v2/otp/verify/{{session_id}}",
        "obscured_auth": "du******@yo*********",
        "obscured_auth_type": "own"
      }
      // setIsApiRunning(true);
      // const response = await forgotPinOtpTrigger(pan ? { pan } : '');
      // setIsApiRunning(false);
      navigate('2fa-verify-pin-otp', {  // "TODO Path name need to be Re-named"
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
      title="Forgot Fisdom PIN"
      skelton={showLoader}
      handleClick={handleClick}
      buttonTitle="Continue"
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