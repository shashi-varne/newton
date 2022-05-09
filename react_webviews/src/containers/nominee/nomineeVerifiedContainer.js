import React, { useMemo } from "react";
import Success from "../../pages/Nominee/Success";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE_VERIFIED } from "businesslogic/strings/nominee";
import { nativeCallback } from "../../utils/native_callback";

const NomineeVerifiedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "nominee_approval",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const onClick = () => {
    const userAction = "next";
    sendEvents(userAction);
  };

  return (
    <WrappedComponent
      sendEvents={sendEvents}
      onClick={onClick}
      productName={productName}
      dataAid={NOMINEE_VERIFIED.screenDataAid}
      title={NOMINEE_VERIFIED.successTitle.text}
      titleDataAid={NOMINEE_VERIFIED.successTitle.dataAid}
      subtitle={NOMINEE_VERIFIED.successSubtitle.text}
      subtitleDataAid={NOMINEE_VERIFIED.successSubtitle.dataAid}
    />
  );
};

export default NomineeVerifiedContainer(Success);
