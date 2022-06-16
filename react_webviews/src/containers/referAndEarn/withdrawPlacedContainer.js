import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import WithdrawPlaced from "../../pages/ReferAndEarn/WithdrawPlaced";

const withdrawPlacedContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);

  console.log({ props });
  const amount = props?.location?.state?.amount || "";
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

  return (
    <WrappedComponent
      amount={amount}
      sendEvents={sendEvents}
      productName={productName}
      navigate={navigate}
    />
  );
};

export default withdrawPlacedContainer(WithdrawPlaced);
