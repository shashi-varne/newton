import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import SuccessDetails from "../../pages/ReferAndEarn/SuccessDetails";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../pages/ReferAndEarn/common/constants";
import { format } from "date-fns";
import { formatAmountInr } from "businesslogic/utils/common/functions";

const successDetailsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const amount = formatAmountInr(props?.location?.state?.amount || "");
  const date = format(new Date(), "dd MMM yyyy");

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
      date={date}
      amount={amount}
      sendEvents={sendEvents}
      productName={productName}
      onClickCta={onClickCta}
    />
  );
};

export default successDetailsContainer(SuccessDetails);
