import React, { useMemo } from "react";
import {
  EXPLORE_CATEGORIES,
  KYC_CARD_STATUS_MAPPER,
  MARKETING_BANNERS,
  MF_INVESTMENT_OPTIONS,
} from "businesslogic/constants/webappLanding";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";

const screen = "MF_LANDING";
const mfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { code } = useMemo(getConfig, []);
  const kycData = KYC_CARD_STATUS_MAPPER.rejected;

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: data.eventName || "mutual_funds_screen",
      properties: {
        user_action: userAction || "",
        primary_category: data.primaryCategory || "generic type",
        card_click: data.cardClick,
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
    sendEvents("next", {
      primaryCategory: "product item",
      cardClick: data.eventStatus,
    });
  };

  const handleExploreCategories = (data) => () => {
    sendEvents("next", {
      primaryCategory: "category item",
      cardClick: data.title?.toLowerCase(),
    });
  };

  const handleKyc = (cardClick) => () => {
    sendEvents("next", {
      primaryCategory: "kyc info",
      cardClick,
    });
  };

  const handleMarketingBanners = (data) => () => {
    const cardClick = data.eventStatus || data.id;
    sendEvents("next", {
      primaryCategory: "marketing banner carousel",
      cardClick,
    });
  };

  return (
    <WrappedComponent
      kycData={kycData}
      marketingBanners={MARKETING_BANNERS}
      investmentOptions={MF_INVESTMENT_OPTIONS}
      exploreCategories={EXPLORE_CATEGORIES}
      showMarketingBanners={true}
      showKycCard={false}
      sendEvents={sendEvents}
      handleKyc={handleKyc}
      handleCardClick={handleCardClick}
      handleExploreCategories={handleExploreCategories}
      handleMarketingBanners={handleMarketingBanners}
    />
  );
};

export default mfLandingContainer(MfLanding);
