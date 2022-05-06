import React, { useMemo } from "react";
import ManualSignature from "../../pages/Nominee/ManualSignature/ManualSignature";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { nativeCallback } from "../../utils/native_callback";

const ManualSignatureContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { kyc, isLoading } = useUserKycHook();
  const email = kyc?.identification?.meta_data.email || "";
  const handleDownloadForm = () => {
    const userAction = "next";
    sendEvents(userAction);
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
    />
  );
};

export default ManualSignatureContainer(ManualSignature);
