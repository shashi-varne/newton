import React, { useEffect, useMemo, useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import {
  EXPLORE_CATEGORIES,
  KYC_BOTOMSHEET_STATUS_MAPPER,
  KYC_CARD_STATUS_MAPPER,
  MANAGE_INVESTMENTS,
  REFERRAL_DATA,
  AUTH_VERIFICATION_DATA,
  PREMIUM_ONBORDING_MAPPER,
} from "../../constants/webappLanding";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch } from "react-redux";
import { fetchSummary } from "businesslogic/dataStore/reducers/app";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import Api from "../../utils/api";
import { setSummaryData } from "../../kyc/services";
import {
  getEnabledMarketingBanners,
  getInvestCardsData,
  handleMarketingBanners,
} from "../../business/appLanding/helper";
const screen = "LANDING";
const portfolioOverViewData = {
  currentValue: "₹19.6Cr",
  investedValue: "₹3.5Cr",
  profitOrLoss: "+ ₹1.2Cr",
  isProfit: true,
};

const campaignData = {
  title: "Setup easySIP",
  imageSrc:
    "https://eqnom-dot-plutus-staging.appspot.com/static/img/ic_sip_mandate_attention_fisdom.png",
  subtitle:
    "Never miss your monthly SIP payments. Setup a secure easySIP in just 2 minutes.",
  primaryButtonTitle: "continue",
};

const DEFAULT_BOTTOMSHEETS_DATA = {
  openKyc: false,
  openReferral: false,
  openAuthVerification: false,
  openAccountAlreadyExists: false,
  openPremiumOnboarding: false,
  openCampaign: false,
};

const signifierKey = "nps";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [showCarousals, setShowCarousals] = useState(true);
  const [errorData, setErrorData] = useState({});
  const [bottomsheetStates, setBottomsheetStates] = useState(
    DEFAULT_BOTTOMSHEETS_DATA
  );
  const {
    code,
    investSections,
    mfOptions,
    onboardingCarousels,
    platformMotivators,
    landingMarketingBanners,
  } = useMemo(getConfig, []);
  const investCardsData = getInvestCardsData(
    investSections,
    signifierKey,
    mfOptions
  );
  const marketingBanners = getEnabledMarketingBanners(landingMarketingBanners);
  const kycData = KYC_CARD_STATUS_MAPPER.rejected;
  const kycBottomsheetData = KYC_BOTOMSHEET_STATUS_MAPPER.esign_ready;
  const premiumData = PREMIUM_ONBORDING_MAPPER.incomplete;
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    const sagaCallback = (response, data) => {
      setSummaryData(response);
    };
    dispatch(fetchSummary({ Api, screen, sagaCallback }));
  };

  useEffect(() => {
    if (isFetchFailed) {
      setErrorData({
        handleClicke: initialize,
        subtitle: errorMessage,
      });
    }
  }, [isFetchFailed]);

  const handleCarousels = (isClose, isBack) => () => {
    const value = isBack ? tabValue - 1 : tabValue + 1;
    const userAction = isClose ? "close" : isBack ? "back" : "next";
    const screenName = onboardingCarousels[tabValue].title || "";
    const data = {
      screenName,
      eventName: "info_carousel",
    };

    if (value >= onboardingCarousels.length) {
      sendEvents(userAction, data);
      setShowCarousals(false);
      return;
    } else if (value < 0) {
      return;
    }

    sendEvents(userAction, data);
    setTabValue(value);
  };

  const handleBottomsheets = (data) => {
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
  };

  const closeBottomsheet = (key) => () => {
    handleBottomsheets({ [key]: false });
  };

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: data.eventName || "home_screen",
      properties: {
        user_action: userAction || "",
        primary_category: data.primaryCategory || "generic type",
        channel: code,
        user_application_status: "",
        user_investment_status: "",
        user_kyc_status: "",
      },
    };

    if (data.screenName) {
      eventObj.properties.screen_name = data.screenName?.toLowerCase();
    }
    if (data.cardClick) {
      eventObj.properties.card_click = data.cardClick;
    }
    if (data.menuName) {
      eventObj.properties.menu_name = data.menuName?.toLowerCase();
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

  const handleEasySip = () => {
    sendEvents("next", {
      cardClick: "setup easysip",
    });
  };

  const handleReferral = () => {
    sendEvents("next", {
      cardClick: "refer clicked",
    });
  };

  const handleManageInvestments = (data) => () => {
    sendEvents("next", {
      menuName: data.title?.toLowerCase(),
      eventName: "bottom_menu_click",
    });
  };

  const onMarketingBannerClick = (data) => () => {
    handleMarketingBanners(data, sendEvents, navigate);
  };

  const handleDiySearch = () => {
    sendEvents("next", {
      eventName: "diy_search_clicked",
    });
  };

  const handleNotification = () => {
    sendEvents("next", {
      menuName: "notification",
      eventName: "bottom_menu_click",
    });
  };

  return (
    <WrappedComponent
      isPageLoading={isPageLoading}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
      tabValue={tabValue}
      handleCarousels={handleCarousels}
      carousalsData={onboardingCarousels}
      showCarousals={showCarousals}
      signfierKey={signifierKey}
      platformMotivators={platformMotivators}
      marketingBanners={marketingBanners}
      kycData={kycData}
      investmentOptions={investCardsData}
      exploreCategories={EXPLORE_CATEGORIES}
      manageInvestments={MANAGE_INVESTMENTS}
      portfolioOverViewData={portfolioOverViewData}
      showPortfolioOverview={true}
      showPlatformMotivators={true}
      showExploreCategories={true}
      showMarketingBanners={true}
      showApplyReferral={false}
      showShareReferral={true}
      showSetupEasySip={true}
      showKycCard={true}
      showLoader={false}
      referralData={REFERRAL_DATA.success}
      kycBottomsheetData={kycBottomsheetData}
      bottomsheetStates={bottomsheetStates}
      authData={AUTH_VERIFICATION_DATA.accountExists}
      campaignData={campaignData}
      premiumData={premiumData}
      closeBottomsheet={closeBottomsheet}
      handleKyc={handleKyc}
      handleCardClick={handleCardClick}
      handleExploreCategories={handleExploreCategories}
      handleEasySip={handleEasySip}
      handleReferral={handleReferral}
      handleManageInvestments={handleManageInvestments}
      onMarketingBannerClick={onMarketingBannerClick}
      sendEvents={sendEvents}
      handleDiySearch={handleDiySearch}
      handleNotification={handleNotification}
    />
  );
};

export default landingContainer(Landing);
