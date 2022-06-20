import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import WithdrawPlaced from "../../pages/ReferAndEarn/WithdrawPlaced";

const withdrawPlacedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  const sendEvents = (userAction) => {
    const eventObj = {
      event_name: "",
      properties: {
        user_action: userAction || "",
        screen_name: "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return <WrappedComponent sendEvents={sendEvents} productName={productName} />;
};

export default withdrawPlacedContainer(WithdrawPlaced);
