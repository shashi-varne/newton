import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { twofaPostApi, modifyPin } from '../../../2fa/common/ApiCalls';

import { navigate as navigateFunc } from "../../../utils/functions";

const ConfirmNewPin = (props) => {
  const routeParams = props.location?.params || {};
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [newMpin, setNewMpin] = useState(false);

  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (routeParams.new_mpin) {
      setNewMpin(routeParams.new_mpin)
    }
  }, []);

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      if (newMpin) {
        if (newMpin !== pin) {
          setPinError("PIN doesn't match, Please try again");
          throw "PIN doesn't match, Please try again";
        } else {
          await modifyPin({ new_mpin: pin, old_mpin: routeParams?.old_mpin });
        }
      } else if (routeParams.reset_url) {
        await twofaPostApi(routeParams?.reset_url, { new_mpin: pin });
      }
      setIsApiRunning(false);
      navigate('security-settings');
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };


  const handlePin = (value) => {
    setPin(value);
    setPinError('');
  }

  return (
    <Container
      skelton={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={pin?.length !== 4}
    >
      <EnterMPin
        title="Confirm fisdom PIN"
        subtitle={newMpin ? "Ensuring maximum security for your investment account" : "Keep your account safe and secure"}
        otpProps={{
          otp: pin,
          handleOtp: handlePin,
          hasError: !!pinError,
          bottomText: pinError || '',
        }}
      />
    </Container>
  )
};

export default ConfirmNewPin;