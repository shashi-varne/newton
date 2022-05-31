import React, { useMemo } from "react";
import { MF_INVEST_OPTIONS } from "businesslogic/constants/webappLanding";
import InvestingOptions from "../../pages/AppLanding/InvestingOptions";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const screen = "INVESTING_OPTIONS";
const investingOptionsContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { code } = useMemo(getConfig, []);

  const sendEvents = (userAction, cardClick = "") => {
    let eventObj = {
      event_name: "investing_options_screen",
      properties: {
        user_action: userAction || "",
        primary_category: "product item",
        card_click: cardClick,
        channel: code,
        user_application_status: "",
        user_investment_status: "",
        user_kyc_status: "",
      },
    };

    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleCardClick = (data) => () => {
    sendEvents("next", data.eventStatus);
  };

  return (
    <WrappedComponent
      investmentOptions={MF_INVEST_OPTIONS}
      handleCardClick={handleCardClick}
      sendEvents={sendEvents}
    />
  );
};

export default investingOptionsContainer(InvestingOptions);
