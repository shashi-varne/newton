import "./commonStyles.scss";
import React, { useState, useEffect } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { verifyPin } from '../../../2fa/common/ApiCalls';
import { navigate as navigateFunc } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import WVPopUpDialog from "../../../common/ui/PopUpDialog/WVPopUpDialog"
import { storageService } from "../../../utils/validators";

const SetPin = (props) => {
  const { routeParams, persistRouteParams } = usePersistRouteParams();
  const navigate = navigateFunc.bind(props);
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openDialogReset, setOpenDialogReset] = useState(false);
  const [kycFlow, setKycFlow] = useState(false);

  useEffect(() => {
    if (storageService().get("kyc_completed_set_pin")) {
      setKycFlow(true)
    }
  }, []);

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      await verifyPin({
        validate_only: true,
        mpin: mpin
      });
      sendEvents("next");
      persistRouteParams({ ...routeParams, new_mpin: mpin, set_flow: true });
      navigate('confirm-pin');
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
      "event_name": '2fa',
      "properties": {
        "user_action": user_action,
        "screen_name": 'set_fisdom_pin',
        "enable_biometrics": "no",
        "journey": "account" // KYC if user has come from KYC jouney ? in which flow does the user comes from KYC Screen 
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
      headerData={kycFlow ? { icon: "close", goBack: () => setOpenDialogReset(true) } : ""}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={mpin?.length !== 4}
      fullWidthButton
    >
      <EnterMPin
        title="Set fisdom PIN"
        subtitle="Ensuring maximum security for your investment account"
        otpProps={{
          otp: mpin,
          handleOtp: onPinChange,
          hasError: !!mpinError,
          bottomText: mpinError || '',
        }}
      />
      <WVPopUpDialog
        open={openDialogReset}
        handleNo={() => setOpenDialogReset(false)}
        handleYes={() => {
          sendEvents("back");
          navigate("/invest");
        }}
        text="This is a mandatory process to complete your application. Do you want to go exit?"
      />
    </Container>
  )
};

export default SetPin;