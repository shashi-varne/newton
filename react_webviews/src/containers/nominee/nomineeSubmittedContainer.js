import React, { useMemo } from "react";
import Success from "../../pages/Nominee/Success";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { NOMINEE_SUBMITTED } from "businesslogic/strings/nominee";
import { nativeCallback } from "../../utils/native_callback";

const NomineeSubmittedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",
      properties: {
        user_action: userAction || "",
        screen_name: "esign_success",
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
      dataAid={NOMINEE_SUBMITTED.title.dataAid}
      title={NOMINEE_SUBMITTED.successTitle.text}
      titleDataAid={NOMINEE_SUBMITTED.successTitle.dataAid}
      subtitle={NOMINEE_SUBMITTED.successSubtitle.text}
      subtitleDataAid={NOMINEE_SUBMITTED.successSubtitle.dataAid}
    />
  );
};

export default NomineeSubmittedContainer(Success);
