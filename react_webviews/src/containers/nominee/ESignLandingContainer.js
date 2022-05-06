import React, { useMemo } from "react";
import ESignLanding from "../../pages/Nominee/ESignLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const ESignLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "nominee",

      properties: {
        user_action: userAction || "",
        screen_name: "esign_landing",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleProceed = () => {
    const userAction = "next";
    sendEvents(userAction);
  };

  return (
    <WrappedComponent
      sendEvents={sendEvents}
      onClickProceed={handleProceed}
      productName={productName}
    />
  );
};

export default ESignLandingContainer(ESignLanding);
