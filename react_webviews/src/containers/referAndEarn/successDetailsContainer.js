import React, { useMemo } from "react";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import SuccessDetails from "../../pages/ReferAndEarn/SuccessDetails";
import { REFER_AND_EARN_PATHNAME_MAPPER } from "../../pages/ReferAndEarn/common/constants";
import { format } from "date-fns";
import { formatAmountInr } from "businesslogic/utils/common/functions";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import { isReadyToInvest } from "../../kyc/services";

const successDetailsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { productName } = useMemo(getConfig, []);
  const { kyc, user, isLoading } = useUserKycHook();
  const amount = formatAmountInr(props?.location?.state?.amount || "");
  const date = format(new Date(), "dd MMM yyyy");

  const onClickCta = () => {
    sendEvents("okay");
    navigate(REFER_AND_EARN_PATHNAME_MAPPER.walletTransfer);
  };

  const sendEvents = (userAction) => {
    const userKycReady = isReadyToInvest();
    const eventObj = {
      event_name: "refer_earn",
      properties: {
        user_action: userAction || "back",
        screen_name: "transfer request placed",
        user_application_status: kyc?.application_status_v2 || "init",
        user_investment_status: user?.active_investment,
        user_kyc_status: userKycReady || false,
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
      date={date}
      amount={amount}
      productName={productName}
      onClickCta={onClickCta}
      sendEvents={sendEvents}
      isPageLoading={isLoading}
    />
  );
};

export default successDetailsContainer(SuccessDetails);
