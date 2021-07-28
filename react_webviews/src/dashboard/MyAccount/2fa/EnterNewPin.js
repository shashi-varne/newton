import "./commonStyles.scss";
import React, { useMemo, useState } from 'react';
import { verifyPin } from '../../../2fa/common/ApiCalls';
import EnterMPin from "../../../2fa/components/EnterMPin";
import Container from "../../common/Container";
import { nativeCallback } from "../../../utils/native_callback";
import { navigate as navigateFunc } from "../../../utils/functions";
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import { isEmpty } from "lodash";
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";

const EnterNewPin = (props) => {
  const { routeParams, persistRouteParams } = usePersistRouteParams();
  const routeParamsExist = useMemo(() => {
    return !isEmpty(routeParams);
  }, []);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);

  const navigate = navigateFunc.bind(props);

  const handlePin = (value) => {
    setPin(value);
    setPinError('');
  }

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      await verifyPin({
        validate_only: true,
        mpin: pin
      });
      setIsApiRunning(false);
      let params = {};
      if (routeParams.reset_flow) {
        params = { old_mpin: routeParams.old_mpin, new_mpin: pin }
      }
      else {
        params = { reset_url: routeParams.reset_url }
      }
      sendEvents("next");
      persistRouteParams({ ...routeParams, ...params})
      navigate("confirm-pin")
    } catch (err) {
      console.log(err);
      setPinError(err);
    } finally {
      setIsApiRunning(false);
    }
  };

  const sendEvents = (user_action) => {
    let eventObj = {
      "event_name": '2fa',
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
      events={sendEvents("just_set_events")}
      title={"Reset fisdom PIN"}
      showLoader={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={pin?.length !== 4}
    >
      <EnterMPin
        title="Enter new fisdom PIN"
        subtitle="Keep your account safe and secure"
        otpProps={{
          otp: pin,
          handleOtp: handlePin,
          hasError: !!pinError,
          bottomText: pinError || '',
        }}
        noData={!routeParamsExist}
        renderNoData={
          <WVInfoBubble
            type="error"
            hasTitle
            customTitle="Session not found or expired"
          >
            Please go back to 'My Account' settings and try again
          </WVInfoBubble>
        }
      />
    </Container>
  )
};

export default EnterNewPin;