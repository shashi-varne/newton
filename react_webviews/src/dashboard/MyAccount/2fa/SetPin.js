import "./commonStyles.scss";
import React, { useState, useMemo } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { verifyPin } from '../../../2fa/common/apiCalls';
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { nativeCallback } from "../../../utils/native_callback";
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import WVPopUpDialog from "../../../common/ui/PopUpDialog/WVPopUpDialog";

const SetPin = (props) => {
  const { persistRouteParams } = usePersistRouteParams();
  const navigate = navigateFunc.bind(props);
  const comingFrom = useMemo(() => props.match?.params?.coming_from, [props]);
  const kycFlow = useMemo(() => comingFrom === 'kyc-complete', [comingFrom]);
  const [mpinError, setMpinError] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  const config = getConfig();

  const handleClick = async () => {
    try {
      setIsApiRunning("button");
      await verifyPin({
        validate_only: true,
        mpin: mpin
      });
      sendEvents("next");
      persistRouteParams({ new_mpin: mpin, set_flow: true });
      let path = '/account/confirm-pin';
      if (comingFrom) {
        path += `/${comingFrom}`;
      }
      navigate(path);
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
        "screen_name": `set_${config.productName}_pin`,
        "journey": kycFlow ?  "KYC" : "account",
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const handleYes = () => {
    sendEvents("back");
    navigate("/");
  }

  return (
    <Container
      title="Security settings"
      events={sendEvents("just_set_events")}
      showLoader={isApiRunning}
      headerData={comingFrom ? { icon: "close", goBack: () => setOpenDialog(true) } : ""}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={mpin?.length !== 4}
      fullWidthButton
    >
      <div style={{ paddingTop: '60px' }}>
        <EnterMPin
          title={`Set ${config.productName} PIN`}
          subtitle="Add an extra layer of security"
          otpProps={{
            otp: mpin,
            handleOtp: onPinChange,
            hasError: !!mpinError,
            bottomText: mpinError || '',
          }}
        />
      </div>
      <WVPopUpDialog
        open={openDialog}
        handleNo={() => setOpenDialog(false)}
        handleYes={handleYes}
        text="This is a mandatory process to complete your application. Do you want to exit?"
      />
    </Container>
  )
};

export default SetPin;