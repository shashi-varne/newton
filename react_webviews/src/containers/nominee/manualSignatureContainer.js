import React, { useEffect, useMemo } from "react";
import ManualSignature from "../../pages/Nominee/ManualSignature/ManualSignature";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";
import { openPdf } from "../../kyc/common/functions";
import { NOMINEE_API_CONSTANTS } from "businesslogic/apis/nominee";
import { getUrlParams } from "../../utils/validators";
import ToastMessage from "../../designSystem/atoms/ToastMessage";

const screen = "MANUAL_SIGNATURE";

const manualSignatureContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { kyc, isLoading } = useUserKycHook();
  const email = kyc?.identification?.meta_data.email || "";

  const handleDownloadForm = () => {
    const userAction = "next";
    sendEvents(userAction);

    const params = getUrlParams();
    const { base_url = "" } = params;
    const formUrl = base_url + NOMINEE_API_CONSTANTS.nominationPdfForm;

    try {
      openPdf(formUrl, "download_kra_form");
    } catch (err) {
      console.log({ err });
      ToastMessage("Something went wrong");
    }
  };

  const onPressOkay = () => {
    const userAction = "next";
    sendEvents(userAction);
    navigate("/nominee/landing");
  };

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "manual_signature",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <WrappedComponent
      email={email}
      onClickDownloadForm={handleDownloadForm}
      sendEvents={sendEvents}
      onPressOkay={onPressOkay}
      isLoading={isLoading}
    />
  );
};

export default manualSignatureContainer(ManualSignature);
