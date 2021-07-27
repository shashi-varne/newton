import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import WVClickableTextElement from "common/ui/ClickableTextElement/WVClickableTextElement"
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { Imgc } from "../../../common/ui/Imgc";
import { nativeCallback } from "../../../utils/native_callback";
import { navigate as navigateFunc } from "../../../utils/functions";
import { verifyPin } from '../../../2fa/common/ApiCalls';

const VerifyPin = (props) => {
  const navigate = navigateFunc.bind(props);
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  useEffect(() => {
    if (mpin.length === 4) {
      handleClick();
    }
  }, [mpin])

  const handleClick = async () => {
    try {
      setIsApiRunning(true);
      await verifyPin({ mpin });
      sendEvents("next");
      navigate('new-pin', {
        params: { reset_flow: true, old_mpin: mpin }
      });
    } catch (err) {
      console.log(err);
      setMpinError(err);
    } finally {
      setIsApiRunning(false);
    }
  }


  const onPinChange = (val) => {
    setMpin(val);
    setMpinError('')
  }

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": 'portfolio',
      "properties": {
        "user_action": user_action,
        "screen_name": 'enter_current_pin',
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents('just_set_events')}
      skelton={isApiRunning}
      handleClick={handleClick}
      noFooter={true}
      hideInPageTitle
      hidePageTitle
    >
      <EnterMPin
        otpProps={{
          otp: mpin,
          handleOtp: onPinChange,
          hasError: !!mpinError,
          bottomText: mpinError || '',
        }}
      >
        <Imgc
          src={require(`assets/padlock1.svg`)}
          alt=""
          style={{ height: '20px', width: '20px', marginBottom: '20px' }}
        />
        <EnterMPin.Title style={{ marginBottom: '75px' }}>
          Enter your current fisdom PIN
        </EnterMPin.Title>
      </EnterMPin>
      <WVClickableTextElement onClick={() => {
        navigate("/forgot-fisdom-pin");
        sendEvents("next");
      }}>
        <p className="clickable-text-ele">FORGOT PIN?</p>
      </WVClickableTextElement>
    </Container>
  )
};

export default VerifyPin;