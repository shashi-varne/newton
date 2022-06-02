import React, { useEffect, useMemo, useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import {
  EXPLORE_CATEGORIES,
  MANAGE_INVESTMENTS,
  REFERRAL_DATA,
  AUTH_VERIFICATION_DATA,
  PREMIUM_ONBORDING_MAPPER,
  BOTTOMSHEET_KEYS,
} from "../../constants/webappLanding";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummary,
  getAppData,
  setKyc,
  updateAppStorage,
} from "businesslogic/dataStore/reducers/app";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import Api from "../../utils/api";
import { setSummaryData } from "../../kyc/services";
import {
  getEnabledMarketingBanners,
  getInvestCardsData,
  handleMarketingBanners,
} from "../../business/appLanding/helper";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";
import {
  getKycData,
  handleStocksAndIpoCards,
  openKyc,
} from "../../dashboard/Invest/functions";
import { storageService } from "../../utils/validators";
import { isEmpty } from "lodash-es";

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

const signifierKey = "stocks";

const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [errorData, setErrorData] = useState({});
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
  });
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
  const { investCardsData, isMfOnly } = getInvestCardsData(
    investSections,
    signifierKey,
    mfOptions
  );
  const marketingBanners = getEnabledMarketingBanners(landingMarketingBanners);
  const premiumData = PREMIUM_ONBORDING_MAPPER.incomplete;
  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const { kyc, user, appStorage } = useSelector(getAppData);
  const kycData = useMemo(() => getKycData(kyc, user), [kyc, user]);
  const [showCarousals, setShowCarousals] = useState(
    !isEmpty(onboardingCarousels) &&
      !kycData.isReadyToInvestBase &&
      !appStorage.isOnboardingCarouselsDisplayed
  );
  const [kycBottomsheetData, setKycBottomsheetData] = useState({});

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = () => {
    const sagaCallback = (response, data) => {
      setSummaryData(response);
      handleBankList(data.bankList);
    };
    dispatch(fetchSummary({ Api, screen, sagaCallback }));
  };

  const handleBankList = (bankList) => {
    if (!isEmpty(bankList)) {
      navigate(WEBAPP_LANDING_PATHNAME_MAPPER.bankList);
    }
  };

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
  };

  const updateKyc = (data) => {
    if (!isEmpty) {
      storageService().setObject("kyc", data);
      dispatch(setKyc(data));
    }
  };

  useEffect(() => {
    if (isFetchFailed) {
      setErrorData({
        handleClick: onLoad,
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
      dispatch(
        updateAppStorage({
          isOnboardingCarouselsDisplayed: true,
        })
      );
      setShowCarousals(false);
      return;
    } else if (value < 0) {
      return;
    }

    sendEvents(userAction, data);
    setTabValue(value);
  };

  const handleBottomsheets = (data, bottomsheetData) => {
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
    if (!isEmpty(bottomsheetData)) {
      setKycBottomsheetData(bottomsheetData);
    }
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

  const handleSummaryData = (data) => {
    updateKyc(data.kyc);
  };

  const handleCardClick = (data) => () => {
    sendEvents("next", {
      primaryCategory: "product item",
      cardClick: data.eventStatus,
    });
    if (["stocks", "ipo"].includes(data.id)) {
      handleStocksAndIpoCards(
        {
          ...kycData,
          key: data.id,
          kyc,
          user,
          navigate,
          handleLoader,
          handleDialogStates: handleBottomsheets,
          handleSummaryData,
          closeKycStatusDialog: closeBottomsheet(BOTTOMSHEET_KEYS.openKyc),
        },
        props
      );
      return;
    }
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
    openKyc({
      ...kycData,
      kyc,
      user,
      navigate,
      handleLoader,
      handleDialogStates: handleBottomsheets,
      updateKyc,
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
    const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
    navigate(pathname);
  };

  const onMarketingBannerClick = (data) => () => {
    handleMarketingBanners(data, sendEvents, navigate);
  };

  const handleDiySearch = () => {
    sendEvents("next", {
      eventName: "diy_search_clicked",
    });
    navigate(WEBAPP_LANDING_PATHNAME_MAPPER.diySearch);
  };

  const handleNotification = () => {
    sendEvents("next", {
      menuName: "notification",
      eventName: "bottom_menu_click",
    });
    navigate(WEBAPP_LANDING_PATHNAME_MAPPER.notification);
  };

  return (
    <WrappedComponent
      isPageLoading={isPageLoading}
      showSkelton={loaderData.skelton}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
      tabValue={tabValue}
      handleCarousels={handleCarousels}
      carousalsData={onboardingCarousels}
      showCarousals={showCarousals}
      signfierKey={signifierKey}
      platformMotivators={platformMotivators}
      marketingBanners={marketingBanners}
      kycData={kycData.kycStatusData}
      investmentOptions={investCardsData}
      exploreCategories={EXPLORE_CATEGORIES}
      manageInvestments={MANAGE_INVESTMENTS}
      portfolioOverViewData={portfolioOverViewData}
      showPortfolioOverview={isMfOnly && kycData.isReadyToInvestBase}
      showPlatformMotivators={!kycData.isReadyToInvestBase}
      showExploreCategories={isMfOnly}
      showSeachIcon={isMfOnly}
      showMarketingBanners={!isMfOnly && kycData.isReadyToInvestBase}
      showMarketingBannersAtBottom={isMfOnly && kycData.isReadyToInvestBase}
      showApplyReferral={false}
      showShareReferral={true}
      showSetupEasySip={true}
      showKycCard={kycData.showKycCard}
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
