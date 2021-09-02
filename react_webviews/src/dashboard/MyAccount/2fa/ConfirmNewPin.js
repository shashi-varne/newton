import "./commonStyles.scss";
import React, { useState, useMemo } from 'react';
import Container from "../../common/Container";
import EnterMPin from "../../../2fa/components/EnterMPin";
import { nativeCallback } from "../../../utils/native_callback";
import { twofaPostApi, modifyPin, setPin } from '../../../2fa/common/apiCalls';
import { getKycFromSummary } from "../../../login_and_registration/functions";
import usePersistRouteParams from '../../../common/customHooks/usePersistRouteParams';
import { getConfig, navigate as navigateFunc } from "../../../utils/functions";
import { isEmpty } from "lodash";
import WVInfoBubble from "../../../common/ui/InfoBubble/WVInfoBubble";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";

const ConfirmNewPin = (props) => {
  const { routeParams, clearRouteParams } = usePersistRouteParams();
  const routeParamsExist = useMemo(() => {
    return !isEmpty(routeParams);
  }, []);
  const { productName, base_url } = getConfig();
  const successText = routeParams.set_flow ? `${productName} security enabled` : `${productName} PIN changed`;
  const comingFrom = useMemo(() => props.match?.params?.coming_from, [props]);
  const kycFlow = useMemo(() => comingFrom === 'kyc-complete', [comingFrom]);
  const [mpin, setMpin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(false);
  const navigate = navigateFunc.bind(props);

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
        "screen_name": `confirm_${productName}_pin`,
        "journey": routeParams.set_flow ? `set_${productName}_pin` : `reset_${productName}_pin`,
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  const handleYes = () => {
    clearRouteParams();
    if (kycFlow) {
      navigate("/invest");
    } else if (comingFrom === 'stocks') {
      setShowPageLoader("page");
      window.location.href = `${base_url}/page/equity/launchapp`;
    } else if (comingFrom === 'ipo') {
      navigate('/market-products');
    } else {
      navigate('/account/security-settings');
    }
  }

  return (
    <Container
      title={routeParams.set_flow  ? "Security settings" : `Reset ${productName} PIN`}
      events={sendEvents("just_set_events")}
      showLoader={isApiRunning || showPageLoader}
      handleClick={handleClick}
      buttonTitle="Continue"
      disable={mpin?.length !== 4}
    >
      <div style={{ paddingTop: '60px' }}>
        <EnterMPin
          title={`Confirm ${productName} PIN`}
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
      <WVBottomSheet
        title={successText}
        image={require(`assets/${productName}/pin_changed.svg`)}
        isOpen={openDialog}
        button1Props={{
          color: "secondary",
          variant: "contained",
          title: "OKAY",
          onClick: handleYes,
        }}
        classes={{
          image: "pin-changed-img"
        }}
      />
    </Container>
  )
};

export default ConfirmNewPin;