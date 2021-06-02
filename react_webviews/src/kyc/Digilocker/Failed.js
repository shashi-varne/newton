import "./Digilocker.scss";
import React, { useState } from "react";
import Container from "../common/Container";
import { getConfig } from "utils/functions";
import { navigate as navigateFunc } from "../common/functions";
import AadhaarDialog from "../mini-components/AadhaarDialog";
import useUserKycHook from "../common/hooks/userKycHook";
import { setKycType } from "../common/api";
import toast from "../../common/ui/Toast";
import "./Digilocker.scss";
import { nativeCallback } from "../../utils/native_callback";

const Failed = (props) => {
  const [open, setOpen] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const retry = () => {
    sendEvents('retry');
    setOpen(true);
  };

  const manual = async () => {
    sendEvents('upload_manually')
    const navigate = navigateFunc.bind(props);
    try {
      setIsApiRunning(true);
      await setKycType("manual");
      navigate("/kyc/journey", { state: { fromState: 'digilocker-failed' }});
    } catch (err) {
      toast(err.message);
    } finally {
      setIsApiRunning(false);
    }
  };

  const {kyc, isLoading} = useUserKycHook();

  const productName = getConfig().productName;

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "kyc_registration",
      properties: {
        user_action: userAction || "",
        screen_name: "aadhar_kyc_failed",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      title="Aadhaar KYC Failed!"
      data-aid='kyc-aadhaar-kyc-failed-screen'
      twoButtonVertical={true}
      button1Props={{
        type: 'primary',
        order: "1",
        title: "RETRY",
        onClick: retry,
      }}
      button2Props={{
        type: 'secondary',
        order: "2",
        title: "UPLOAD DOCUMENTS MANUALLY",
        onClick: manual,
        showLoader: isApiRunning
      }}
      skelton={isLoading}
      // disableBack
      headerData={{ icon: "close" }}
    >
      <section id="digilocker-failed"  data-aid='kyc-digilocker-failed'>
        <img
          className="digi-image"
          alt=""
          src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
        />
        <div className="body-text1" data-aid='kyc-body-text1'>
          Aadhaar KYC has been failed because we were not able to connect to
          your Digilocker.
        </div>
      </section>
      <AadhaarDialog
        open={open}
        id="kyc-aadhaar-dialog"
        close={close}
        kyc={kyc}
      />
    </Container>
  );
};

export default Failed;
