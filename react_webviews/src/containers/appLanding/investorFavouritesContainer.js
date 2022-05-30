import React from "react";
import { INVESTER_FAVOURITES } from "businesslogic/constants/webappLanding";
import InvestorFavorites from "../../pages/AppLanding/InvestorFavorites";
import { navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const screen = "INVESTOR_FAVORITES";
const investorFavoritesContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);

  const sendEvents = (userAction, cardClick = "") => {
    let eventObj = {
      event_name: "investing_options_screen",
      properties: {
        user_action: userAction || "",
        primary_category: "product item",
        card_click: cardClick,
        channel: "",
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
      investmentOptions={INVESTER_FAVOURITES}
      handleCardClick={handleCardClick}
      sendEvents={sendEvents}
    />
  );
};

export default investorFavoritesContainer(InvestorFavorites);
