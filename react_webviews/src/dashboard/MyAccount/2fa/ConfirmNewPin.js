import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { nativeCallback } from "../../../utils/native_callback";
import { twofaPostApi, modifyPin, setPin } from '../../../2fa/common/ApiCalls';
import { storageService } from "../../../utils/validators";
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';

import { navigate as navigateFunc } from "../../../utils/functions";

const ConfirmNewPin = (props) => {
  const { routeParams, clearRouteParams } = usePersistRouteParams();
  const [mpin, setMpin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [newMpin, setNewMpin] = useState(false);
  const [kycFlow, setKycFlow] = useState(false);

  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (props.match.params?.coming_from === "kyc-complete") {
      setKycFlow(true)
    }
    if (routeParams.new_mpin) {
      setNewMpin(routeParams.new_mpin)
    }
  }, []);

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      if (newMpin) {
        if (newMpin !== mpin) {
          throw "PIN doesn't match, Please try again";
        } else if (routeParams.set_flow) {
          await setPin({ mpin })
        } else {
          await modifyPin({ new_mpin: mpin, old_mpin: routeParams?.old_mpin });
        }
      } else if (routeParams.reset_url) {
        await twofaPostApi(routeParams?.reset_url, { new_mpin: mpin });
      }
      setIsApiRunning(false);
      sendEvents("next");
      clearRouteParams();
      if (kycFlow) {
        navigate('/landing')
      } else navigate('/security-settings');
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };


  const handlePin = (value) => {
    setMpin(value);
    setPinError('');
  }

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": 'confirm_fisdom_pin',

        "journey": routeParams.set_flow ? "set_fisdom_pin" : "reset_fisdom_pin",
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
      showLoader={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={mpin?.length !== 4}
    >
      <EnterMPin
        title="Confirm fisdom PIN"
        subtitle={newMpin ? "Ensuring maximum security for your investment account" : "Keep your account safe and secure"}
        otpProps={{
          otp: mpin,
          handleOtp: handlePin,
          hasError: !!pinError,
          bottomText: pinError || '',
        }}
      />
    </Container>
  )
};

export default ConfirmNewPin;