import React, { useMemo } from "react";
import {
  EXPLORE_CATEGORIES,
  KYC_CARD_STATUS_MAPPER,
} from "businesslogic/constants/webappLanding";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  getEnabledMarketingBanners,
  getInvestCardsData,
  handleMarketingBanners,
} from "../../business/appLanding/helper";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";

const screen = "MF_LANDING";
const mfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const { code, mfOptions, landingMarketingBanners } = useMemo(getConfig, []);
  const investCardsData = getInvestCardsData(mfOptions);
  const marketingBanners = getEnabledMarketingBanners(landingMarketingBanners);
  const kycData = KYC_CARD_STATUS_MAPPER.rejected;

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: data.eventName || "mutual_funds_screen",
      properties: {
        user_action: userAction || "",
        primary_category: data.primaryCategory || "generic type",
        card_click: data.cardClick || "",
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
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  const handleExploreCategories = (data) => () => {
    sendEvents("next", {
      primaryCategory: "category item",
      cardClick: data.title?.toLowerCase(),
    });
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  const handleKyc = (cardClick) => () => {
    sendEvents("next", {
      primaryCategory: "kyc info",
      cardClick,
    });
  };

  const onMarketingBannerClick = (data) => () => {
    handleMarketingBanners(data, sendEvents, navigate);
  };

  const onRightIconClick = () => {
    sendEvents("next", {
      eventName: "diy_search_clicked",
    });
    navigate(WEBAPP_LANDING_PATHNAME_MAPPER.diySearch);
  };

  return (
    <WrappedComponent
      kycData={kycData}
      marketingBanners={marketingBanners}
      investmentOptions={investCardsData}
      exploreCategories={EXPLORE_CATEGORIES}
      showMarketingBanners={true}
      showKycCard={true}
      sendEvents={sendEvents}
      handleKyc={handleKyc}
      handleCardClick={handleCardClick}
      handleExploreCategories={handleExploreCategories}
      onMarketingBannerClick={onMarketingBannerClick}
      onRightIconClick={onRightIconClick}
    />
  );
};

export default mfLandingContainer(MfLanding);
