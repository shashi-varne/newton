import React, { useEffect, useMemo, useState } from "react";
import MfLanding from "../../pages/AppLanding/MfLanding";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import { nativeCallback } from "../../utils/native_callback";
import {
  getContactVerification,
  getEnabledMarketingBanners,
  getInvestCardsData,
  handleMarketingBanners,
} from "../../business/appLanding/functions";
import {
  EXPLORE_CATEGORIES,
  WEBAPP_LANDING_PATHNAME_MAPPER,
} from "../../constants/webappLanding";
import {
  getKycData,
  handleKycStatus,
  handleKycStatusRedirection,
} from "../../dashboard/Invest/functions";
import { useSelector } from "react-redux";
import { getAppData } from "businesslogic/dataStore/reducers/app";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";

const initializeData = () => {
  const {
    code,
    featuresList,
    mfOptions,
    landingMarketingBanners,
    ...baseConfig
  } = getConfig();
  const { investCardsData } = getInvestCardsData(mfOptions);
  const { isMfOnly } = getInvestCardsData(featuresList);
  const marketingBanners = getEnabledMarketingBanners(landingMarketingBanners);
  return {
    code,
    marketingBanners,
    investCardsData,
    isMfOnly,
    baseConfig,
  };
};

const mfLandingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
  });
  const [bottomsheetStates, setBottomsheetStates] = useState({
    openKycStatusDialog: false,
  });
  const { kyc, user, partner, subscriptionStatus } = useSelector(getAppData);
  const { code, marketingBanners, baseConfig, investCardsData, isMfOnly } =
    useMemo(initializeData, [partner, subscriptionStatus, kyc]);
  const { updateKyc } = useUserKycHook();

  useEffect(() => {
    if (isMfOnly) {
      navigate("/");
    }
  }, []);

  const initializeKycData = () => {
    const kycData = getKycData(kyc, user);
    const contactDetails = getContactVerification(kyc, false);
    return {
      kycData,
      contactDetails,
    };
  };

  const { kycData, contactDetails } = useMemo(initializeKycData, [kyc, user]);

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: data.eventName || "mutual_funds_screen",
      properties: {
        user_action: userAction || "",
        primary_category: data.primaryCategory || "generic type",
        card_click: data.cardClick || "",
        channel: code,
        user_application_status: kycData.applicationStatus,
        user_investment_status: kycData.isMfInvested,
        user_kyc_status: kycData.isReadyToInvestBase,
      },
    };

    if (data.intent) {
      eventObj.properties.intent = data.intent;
      eventObj.properties.outside_click = !!data.outsideClick;
      eventObj.event_name = "bottom_sheet";
    }

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

  const closeKycStatusDialog = (outsideClick = false) => {
    sendEvents("back", {
      intent: kycData.kycBottomsheetData?.title,
      outsideClick,
      eventName: "bottom_sheet",
    });
  };

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
  };

  const handleBottomsheets = (data) => {
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
  };

  return (
    <WrappedComponent
      kycData={kycData.kycStatusData}
      kycBottomsheetData={kycData.kycBottomsheetData}
      marketingBanners={marketingBanners}
      investmentOptions={investCardsData}
      exploreCategories={EXPLORE_CATEGORIES}
      showMarketingBanners={kycData.isReadyToInvestBase}
      showKycCard={kycData.showKycCard}
      bottomsheetStates={bottomsheetStates}
      sendEvents={sendEvents}
      handleKyc={handleKyc}
      handleCardClick={handleCardClick}
      handleExploreCategories={handleExploreCategories}
      onMarketingBannerClick={onMarketingBannerClick}
      onRightIconClick={onRightIconClick}
      handleKycPrimaryClick={handleKycStatus({
        kyc,
        kycData,
        modalData: kycData.kycBottomsheetData,
        navigate,
        updateKyc,
        closeKycStatusDialog,
        handleLoader,
        sendEvents,
      })}
      handleKycSecondaryClick={handleKycStatusRedirection(
        {
          kyc,
          user,
          kycData,
          modalData: kycData.kycBottomsheetData,
          baseConfig,
          contactDetails,
          navigate,
          handleLoader,
          handleDialogStates: handleBottomsheets,
        },
        props
      )}
    />
  );
};

export default mfLandingContainer(MfLanding);
