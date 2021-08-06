import "./commonStyles.scss";
import React, { useState, useEffect, useMemo } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { nativeCallback } from "../../../utils/native_callback";
import { twofaPostApi, modifyPin, setPin } from '../../../2fa/common/apiCalls';
import { getKycFromSummary } from "../../../login_and_registration/functions";
import WVPopUpDialog from "../../../common/ui/PopUpDialog/WVPopUpDialog";
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import { navigate as navigateFunc } from "../../../utils/functions";
import { isEmpty } from "lodash";
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";

const ConfirmNewPin = (props) => {
  const { routeParams, clearRouteParams } = usePersistRouteParams();
  const routeParamsExist = useMemo(() => {
    return !isEmpty(routeParams);
  }, []);
  const successText = routeParams.set_flow ? "fisdom security enabled" : "fisdom PIN changed";
  const [mpin, setMpin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [kycFlow, setKycFlow] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    if (props.match.params?.coming_from === "kyc-complete") {
      setKycFlow(true)
    }
  }, []);

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      const { new_mpin } = routeParams;
      if (new_mpin) {
        if (new_mpin !== mpin) {
          // eslint-disable-next-line no-throw-literal
          throw "PIN doesn't match, Please try again";
        } else if (routeParams.set_flow) {
          await setPin({ mpin });
        } else {
          await modifyPin({ new_mpin: mpin, old_mpin: routeParams?.old_mpin });
        }
      } else if (routeParams.reset_url) {
        await twofaPostApi(routeParams?.reset_url, { new_mpin: mpin });
      }
      sendEvents("next");
      await getKycFromSummary({
        kyc: ["kyc"],
        user: ["user"]
      });
      clearRouteParams();
      setIsApiRunning(false);
      setOpenDialog(true);
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

  const handleYes = () => {
    if (kycFlow) {
      navigate("/invest");
    } else {
      navigate('/security-settings');
    }
  }

  return (
    <Container
      title={routeParams.set_flow  ? "Security settings" : "Reset fisdom PIN"}
      events={sendEvents("just_set_events")}
      showLoader={isApiRunning}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={mpin?.length !== 4}
    >
      <div style={{ paddingTop: '60px' }}>
        <EnterMPin
          title="Confirm fisdom PIN"
          subtitle={routeParams.set_flow  ? "Ensuring maximum security for your investment account" : "Keep your account safe and secure"}
          otpProps={{
            otp: mpin,
            handleOtp: handlePin,
            hasError: !!pinError,
            bottomText: pinError || '',
          }}
          noData={!routeParamsExist}
          renderNoData={
            <WVInfoBubble
              type="error"
              hasTitle
              customTitle="Session not found or expired."
            >
              Please go back to <b>My Account &gt; Security settings</b> and try again
            </WVInfoBubble>
          }
        />
      </div>
      <WVPopUpDialog
        open={openDialog}
        handleYes={handleYes}
        text={successText}
        optionYes="OKAY"
        optionNo=""
      />
    </Container>
  )
};

export default ConfirmNewPin;