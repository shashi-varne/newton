import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import SuccessDetails from "../../pages/ReferAndEarn/SuccessDetails";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../pages/ReferAndEarn/common/constants";

const successDetailsContainer = (WrappedComponent) => (props) => {
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

  const onClickCta = () => {
    navigate(REFER_AND_EARN_PATHNAME_MAPPER.walletTransfer);
  };

  return (
    <WrappedComponent
      date="10 Oct 2021"
      amount="2000"
      sendEvents={sendEvents}
      productName={productName}
      onClickCta={onClickCta}
    />
  );
};

export default successDetailsContainer(SuccessDetails);
