import React, { useEffect, useMemo, useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import {
  SHARE_REFERRAL_DATA,
  MANAGE_INVESTMENTS,
  REFERRAL_DATA,
  AUTH_VERIFICATION_DATA,
  BOTTOMSHEET_KEYS,
  APPSTORAGE_KEYS,
  CAMPAIGNS_TO_SHOW_ON_PRIORITY,
  EXPLORE_CATEGORY_DATA,
} from "../../constants/webappLanding";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummary,
  getAppData,
  updateAppStorage,
} from "businesslogic/dataStore/reducers/app";
import useLoadingState from "../../common/customHooks/useLoadingState";
import useErrorState from "../../common/customHooks/useErrorState";
import Api from "../../utils/api";
import {
  getEnabledMarketingBanners,
  getInvestCardsData,
  handleMarketingBanners,
  getContactVerification,
  getKycBottomsheetData,
  handleCampaign,
  closeCampaignDialog,
  setSummaryData,
  getEnabledPlatformMotivators,
} from "../../business/appLanding/functions";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";
import {
  getCampaignData,
  getKycData,
  handleKycStatus,
  handleKycStatusRedirection,
  handleStocksAndIpoCards,
  openKyc,
} from "../../dashboard/Invest/functions";
import { isEmpty, noop } from "lodash-es";
import {
  applyReferralCode,
  authVerification,
  generateOtp,
  getPortfolioData,
} from "businesslogic/apis/app";
import ToastMessage from "../../designSystem/atoms/ToastMessage";
import useUserKycHook from "../../kyc/common/hooks/userKycHook";
import useLongPress from "../../common/customHooks/useLongPress";

const screen = "LANDING";

const DEFAULT_BOTTOMSHEETS_DATA = {
  openKycStatusDialog: false,
  openReferral: false,
  openAuthVerification: false,
  openAccountAlreadyExists: false,
  openPremiumOnboarding: false,
  openCampaign: false,
};

/* eslint-disable */
const landingContainer = (WrappedComponent) => (props) => {
  const navigate = navigateFunc.bind(props);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [errorData, setErrorData] = useState({});
  const [loaderData, setLoaderData] = useState({
    skelton: false,
    pageLoader: false,
    dotLoader: false,
  });
  const [bottomsheetStates, setBottomsheetStates] = useState(
    DEFAULT_BOTTOMSHEETS_DATA
  );

  const { isPageLoading } = useLoadingState(screen);
  const { isFetchFailed, errorMessage } = useErrorState(screen);
  const { updateKyc } = useUserKycHook();
  const {
    kyc,
    user,
    appStorage,
    partner,
    subscriptionStatus,
    bankList,
    referral: referralContent,
  } = useSelector(getAppData);
  const [kycData, setKycData] = useState(getKycData(kyc, user));
  const [swiper, setSwiper] = useState(null);
  const [campaignData, setCampaignData] = useState({});
  const [referral, setReferral] = useState("");
  const [contactDetails, setContactDetails] = useState({});
  const [kycBottomsheetData, setKycBottomsheetData] = useState({});
  const [referralData, setReferralData] = useState({});
  const [showPortfolioLoader, setShowPorfolioLoader] = useState(false);
  const [portfolioOverViewData, setPortfolioOverViewData] = useState({});

  const initializeData = () => {
    const {
      code,
      landingSections,
      featuresList,
      mfOptions,
      onboardingCarousels,
      platformMotivators,
      landingMarketingBanners,
      ...baseConfig
    } = getConfig();
    const {
      investCardsData,
      isMfOnly,
      showPortfolioOverview,
      enabledFeatures,
    } = getInvestCardsData(featuresList, appStorage.feature, mfOptions, 4);
    const marketingBanners = getEnabledMarketingBanners(
      landingMarketingBanners,
      enabledFeatures
    );
    const motivators = getEnabledPlatformMotivators(
      platformMotivators,
      enabledFeatures
    );
    const isFinity = baseConfig.productName === "finity";
    const showExploreCategories = isMfOnly || isFinity;
    const showSearchIcon = isMfOnly || isFinity;
    const exploreCategoryData = EXPLORE_CATEGORY_DATA[baseConfig.productName];
    const shareReferralData = SHARE_REFERRAL_DATA[baseConfig.productName];
    return {
      code,
      onboardingCarousels,
      marketingBanners,
      landingSections,
      investCardsData,
      isMfOnly,
      showPortfolioOverview,
      baseConfig,
      platformMotivators: motivators,
      showExploreCategories,
      exploreCategoryData,
      isFinity,
      shareReferralData,
      showSearchIcon,
    };
  };

  const {
    code,
    onboardingCarousels,
    platformMotivators,
    marketingBanners,
    baseConfig,
    investCardsData,
    landingSections,
    isMfOnly,
    isFinity,
    showPortfolioOverview,
    showSetupEasySip,
    showExploreCategories,
    exploreCategoryData,
    shareReferralData,
    showSearchIcon,
  } = useMemo(initializeData, [
    partner,
    subscriptionStatus,
    kyc,
    appStorage.feature,
    referralContent,
  ]);

  const [showCarousals, setShowCarousals] = useState(
    !isEmpty(onboardingCarousels) &&
      baseConfig.isSdk &&
      appStorage.firstLogin &&
      !appStorage.isOnboardingCarouselsDisplayed
  );

  const getReferalConfig = () => {
    const showShareReferral =
      kycData.isMfInvested &&
      !baseConfig.Web &&
      baseConfig?.referralConfig?.shareRefferal;
    const showApplyReferral =
      !kycData.isMfInvested &&
      !baseConfig.Web &&
      baseConfig?.referralConfig?.applyRefferal;
    return {
      showApplyReferral,
      showShareReferral,
    };
  };

  const { showApplyReferral, showShareReferral } = useMemo(getReferalConfig, [
    user,
    partner,
  ]);

  const getLandingSections = () => {
    if (showPortfolioOverview && showSetupEasySip) {
      const list = landingSections.filter(
        (data) => data !== "marketingBanners"
      );
      const index = list.indexOf("featuresList");
      list.splice(index + 1, 0, "marketingBanners");
      return list;
    }
    return landingSections;
  };
  const mainLandingSections = useMemo(getLandingSections, [
    showPortfolioOverview,
    showSetupEasySip,
  ]);

  useEffect(() => {
    onLoad();
  }, []);

  const handleSlideChange = (swiper) => {
    const value = swiper?.activeIndex;
    if (value !== tabValue) {
      const userAction = value === tabValue - 1 ? "back" : "next";
      handleTabChange(value, userAction, false, true);
    }
  };

  const onLoad = () => {
    if (code === "moneycontrol") {
      navigate(WEBAPP_LANDING_PATHNAME_MAPPER.investExplore);
      return;
    }
    if (baseConfig.isSdk && baseConfig.Android) {
      nativeCallback({ action: "get_data" });
    }
    if (appStorage.dataSettedInsideBoot) {
      dispatch(
        updateAppStorage({
          dataSettedInsideBoot: false,
        })
      );
      if (isEmpty(bankList)) {
        handleLandingBottomsheets(kycData);
      }
      return;
    }
    fetchSummaryData();
  };

  const fetchSummaryData = () => {
    const sagaCallback = (response, data) => {
      setSummaryData(response, true);
      const kycDetails = getKycData(data.kyc, data.user);
      setKycData(kycDetails);
      if (isEmpty(data.bankList)) {
        handleLandingBottomsheets(kycDetails);
      }
    };
    dispatch(fetchSummary({ Api, screen, sagaCallback }));
  };

  const handleBankList = () => {
    if (!showCarousals && !isEmpty(bankList)) {
      navigate(WEBAPP_LANDING_PATHNAME_MAPPER.bankList);
    }
  };

  useEffect(() => {
    handleBankList();
  }, [showCarousals, bankList]);

  const handleLandingBottomsheets = (kycDetails) => {
    let campaignBottomSheetData = {},
      bottomsheetData = {};
    const contactData = getContactVerification(
      kycDetails.kyc,
      appStorage.isAuthVerificationDisplayed,
      screen
    );
    setContactDetails(contactData);

    if (!appStorage.isCampaignDisplayed) {
      campaignBottomSheetData = getCampaignData();
      setCampaignData(campaignBottomSheetData);
    }
    if (
      !appStorage.isKycBottomsheetDisplayed ||
      !appStorage.isPremiumBottomsheetDisplayed
    ) {
      bottomsheetData = getKycBottomsheetData(
        kycDetails,
        appStorage,
        code,
        baseConfig.productName
      );
    }

    const isPriorityCampaign = CAMPAIGNS_TO_SHOW_ON_PRIORITY.includes(
      campaignBottomSheetData.campaign_name
    );
    let bottomsheetKey = "";
    let appStorageKey = "";
    if (isPriorityCampaign) {
      bottomsheetKey = BOTTOMSHEET_KEYS.openCampaign;
      appStorageKey = APPSTORAGE_KEYS.isCampaignDisplayed;
    } else if (contactData.showAuthVerification) {
      bottomsheetKey = BOTTOMSHEET_KEYS.openAuthVerification;
      appStorageKey = APPSTORAGE_KEYS.isAuthVerificationDisplayed;
    } else if (bottomsheetData.showKycBottomsheet) {
      bottomsheetKey = BOTTOMSHEET_KEYS.openKycStatusDialog;
      appStorageKey = APPSTORAGE_KEYS.isKycBottomsheetDisplayed;
      setKycBottomsheetData(bottomsheetData.modalData);
    } else if (bottomsheetData.showPremiumOnboarding) {
      bottomsheetKey = BOTTOMSHEET_KEYS.openPremiumOnboarding;
      appStorageKey = APPSTORAGE_KEYS.isPremiumBottomsheetDisplayed;
      setKycBottomsheetData(bottomsheetData.premiumDialogData);
    } else if (!isEmpty(campaignBottomSheetData)) {
      bottomsheetKey = BOTTOMSHEET_KEYS.openCampaign;
      appStorageKey = APPSTORAGE_KEYS.isCampaignDisplayed;
    }
    if (!isEmpty(bottomsheetKey)) {
      handleBottomsheets({
        [bottomsheetKey]: true,
      });
      dispatch(
        updateAppStorage({
          [appStorageKey]: true,
        })
      );
    }
  };

  useEffect(() => {
    handlePortfolio();
  }, [showPortfolioOverview]);

  const handlePortfolio = async () => {
    if (!showPortfolioOverview) {
      return;
    }
    try {
      setShowPorfolioLoader(true);
      const result = await getPortfolioData(Api);
      const currentData = result.current || {};
      const currentValue = currentData?.current;
      const investedValue = currentData.invested;
      const profitOrLoss = currentData.earnings;
      const data = {
        currentValue,
        investedValue,
        profitOrLoss,
        isProfit: profitOrLoss >= 0,
      };
      setPortfolioOverViewData(data);
    } catch (err) {
      setErrorData({
        handleClick: handlePortfolio,
        subtitle: err.message,
        isFetchFailed: true,
      });
    } finally {
      setShowPorfolioLoader(false);
    }
  };

  useEffect(() => {
    openEquity();
  }, [appStorage.openEquityCallback]);

  const openEquity = () => {
    if (appStorage.openEquityCallback) {
      dispatch(
        updateAppStorage({
          openEquityCallback: false,
        })
      );
      nativeCallback({
        action: "open_equity",
      });
    }
  };

  const handleLoader = (data) => {
    setLoaderData({ ...loaderData, ...data });
  };

  useEffect(() => {
    if (isFetchFailed) {
      setErrorData({
        handleClick: onLoad,
        subtitle: errorMessage,
      });
    }
  }, [isFetchFailed]);

  const { isLongPressTriggered, ...longPressEvent } = useLongPress(
    noop,
    noop,
    100
  );

  useEffect(() => {
    if (swiper) {
      if (isLongPressTriggered) {
        swiper?.autoplay?.stop();
      } else {
        swiper?.autoplay?.start();
      }
    }
  }, [isLongPressTriggered]);

  const handleTabChange = (
    value,
    userAction,
    isClose,
    skipSwiperUpdate = false
  ) => {
    const screenName = onboardingCarousels[tabValue].title || "";
    const data = {
      screenName,
      eventName: "info_carousel",
    };
    const isFinalTab = tabValue === onboardingCarousels.length - 1;
    const slideLoop = value === 0 && isFinalTab;
    const slideExceeded = value >= onboardingCarousels.length;
    const hideCarousels = slideLoop || isClose || slideExceeded;
    if (hideCarousels) {
      sendEvents(userAction, data);
      dispatch(
        updateAppStorage({
          isOnboardingCarouselsDisplayed: true,
        })
      );
      setShowCarousals(false);
      setSwiper(null);
      return;
    } else if (value < 0) {
      return;
    }

    sendEvents(userAction, data);
    setTabValue(value);
    if (swiper && !skipSwiperUpdate) {
      swiper?.slideTo(value);
    }
  };

  const handleCarousels = (isClose, isBack) => () => {
    const value = isBack ? tabValue - 1 : tabValue + 1;
    const userAction = isClose ? "close" : isBack ? "back" : "next";
    handleTabChange(value, userAction, isClose);
  };

  const handleBottomsheets = (data = {}, bottomsheetData) => {
    setBottomsheetStates({
      ...bottomsheetStates,
      ...data,
    });
    if (!isEmpty(bottomsheetData)) {
      setKycBottomsheetData(bottomsheetData);
    }
  };

  const closeBottomsheet =
    (key, intent, skipEvents = false) =>
    (outsideClick = false) => {
      handleBottomsheets({ [key]: false });
      if (!skipEvents) {
        sendEvents("back", {
          eventName: "bottom_sheet",
          intent,
          outsideClick,
        });
      }
    };

  const sendEvents = (userAction, data = {}) => {
    let eventObj = {
      event_name: data.eventName || "home_screen",
      properties: {
        user_action: userAction || "",
        channel: code,
        user_application_status: kycData.applicationStatus,
        user_investment_status: kycData.isMfInvested,
        user_kyc_status: kycData.isReadyToInvestBase,
      },
    };

    if (data.primaryCategory) {
      eventObj.properties.primary_category = data.primaryCategory;
    }

    if (data.screenName) {
      eventObj.properties.screen_name = data.screenName?.toLowerCase();
    }
    if (data.cardClick) {
      eventObj.properties.card_click = data.cardClick;
    }
    if (data.menuName) {
      eventObj.properties.menu_name = data.menuName?.toLowerCase();
    }
    if (data.intent) {
      eventObj.event_name = "bottom_sheet";
      eventObj.properties.intent = data.intent;
      eventObj.properties.outside_click = !!data.outsideClick;
      delete eventObj.properties.primary_category;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleCardClick =
    (data = {}) =>
    () => {
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
            closeKycStatusDialog: closeBottomsheet(
              BOTTOMSHEET_KEYS.openKycStatusDialog,
              kycBottomsheetData.title
            ),
          },
          props
        );
        return;
      }
      const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
      navigate(pathname);
    };

  const handleExploreCategories =
    (data = {}) =>
    () => {
      if (isFinity) {
        dispatch(
          updateAppStorage({
            categoryTitle: data.title,
          })
        );
      }
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
      primaryCategory: "generic type",
    });
  };

  const handleReferral = () => {
    sendEvents("next", {
      cardClick: "refer clicked",
      primaryCategory: "generic type",
    });

    if (showApplyReferral) {
      if (!referral) {
        ToastMessage("Please enter referral code");
        return;
      }
      applyReferral();
    } else {
      navigate(WEBAPP_LANDING_PATHNAME_MAPPER.refer);
    }
  };

  const handleManageInvestments =
    (data = {}) =>
    () => {
      sendEvents("next", {
        menuName: data.title?.toLowerCase(),
        eventName: "bottom_menu_click",
      });
      const pathname = WEBAPP_LANDING_PATHNAME_MAPPER[data.id];
      navigate(pathname);
    };

  const openPageLoader = () => {
    handleLoader({
      pageLoader: true,
    });
  };

  const onMarketingBannerClick =
    (data = {}) =>
    () => {
      handleMarketingBanners(data, sendEvents, navigate, openPageLoader);
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

  const handleAuthEdit = () => {
    sendEvents("edit", {
      intent: contactDetails.title,
    });
    navigate("/secondary-verification", {
      state: {
        page: "landing",
        edit: true,
        communicationType: contactDetails.contactType,
        contactValue: contactDetails.contactValue,
      },
    });
  };

  const handleAuthVerification = async () => {
    if (contactDetails.showAuthExists) {
      handleAuthEdit();
      return;
    }
    sendEvents("next", {
      intent: contactDetails.title,
    });
    try {
      handleLoader({
        bottomsheetLoader: true,
      });
      const result = await authVerification(Api, contactDetails);
      if (result.is_user) {
        const userData = result.user;
        const { mobile, email, pan_number } = userData;
        const accountExistsData = AUTH_VERIFICATION_DATA.accountExists;
        let authType = "Email",
          authValue = email,
          primaryButtonTitle = `${accountExistsData.buttonTitle} Number`,
          subtitle = `Mobile number ${accountExistsData.commonSubtitle}`;
        if (contactDetails.contactType === "email") {
          authType = "Mobile";
          authValue = mobile;
          primaryButtonTitle = `${accountExistsData.buttonTitle} Email`;
          subtitle = `Email address ${accountExistsData.commonSubtitle}`;
        }
        setContactDetails({
          ...contactDetails,
          ...accountExistsData,
          authType,
          authValue,
          primaryButtonTitle,
          subtitle,
          pan: pan_number,
        });
      } else {
        let body = {};
        if (contactDetails.contactType === "email") {
          body.email = contactDetails.contactValue;
        } else {
          body.mobile = contactDetails.contactValue;
          body.whatsapp_consent = true;
        }
        const otpRes = await generateOtp(Api, body);
        ToastMessage(otpRes.message || "Success");
        navigate("/secondary-otp-verification", {
          state: {
            value: contactDetails?.contactValue,
            otp_id: result.otp_id,
            communicationType: contactDetails.contactType,
          },
        });
      }
    } catch (err) {
      console.log("err");
      ToastMessage(err.message);
    } finally {
      handleLoader({
        bottomsheetLoader: false,
      });
    }
  };

  const handleReferralChange = (e) => {
    const value = e.target.value;
    setReferral(value);
  };

  const applyReferral = async () => {
    try {
      handleLoader({ dotLoader: true });
      await applyReferralCode(Api, referral);
      setReferralData(REFERRAL_DATA.success);
      handleBottomsheets({ [BOTTOMSHEET_KEYS.openReferral]: true });
    } catch (err) {
      setReferralData({
        ...REFERRAL_DATA.failed,
        subtitle: err.message,
      });
      handleBottomsheets({ [BOTTOMSHEET_KEYS.openReferral]: true });
    } finally {
      handleLoader({ dotLoader: false });
    }
  };

  const handleReferralBottomsheet = () => {
    sendEvents("next", {
      intent: referralData.title,
    });
    handleBottomsheets({ [BOTTOMSHEET_KEYS.openReferral]: false });
  };

  const handlePremiumOnboarding = () => {
    if (
      kycBottomsheetData.nextState &&
      (!isMfOnly || kycBottomsheetData.nextState !== "/invest")
    ) {
      navigate(kycBottomsheetData.nextState);
    }
    handleBottomsheets({
      [BOTTOMSHEET_KEYS.openPremiumOnboarding]: false,
    });
  };

  return (
    <WrappedComponent
      hideBackIcon={baseConfig.Web}
      showPartnership={baseConfig.isSdk}
      productName={baseConfig.productName}
      landingSections={mainLandingSections}
      isPageLoading={isPageLoading}
      loaderData={loaderData}
      isFetchFailed={isFetchFailed}
      errorData={errorData}
      tabValue={tabValue}
      handleCarousels={handleCarousels}
      handleSlideChange={handleSlideChange}
      setSwiper={setSwiper}
      longPressEvent={longPressEvent}
      isLongPressTriggered={isLongPressTriggered}
      carousalsData={onboardingCarousels}
      showCarousals={showCarousals}
      feature={appStorage.feature}
      platformMotivators={platformMotivators}
      marketingBanners={marketingBanners}
      kycData={kycData.kycStatusData}
      investmentOptions={investCardsData}
      exploreCategoryData={exploreCategoryData}
      manageInvestments={MANAGE_INVESTMENTS}
      portfolioOverViewData={portfolioOverViewData}
      showPortfolioOverview={showPortfolioOverview}
      showPortfolioLoader={showPortfolioLoader}
      showPlatformMotivators={
        !isEmpty(platformMotivators) && !kycData.isReadyToInvestBase
      }
      showExploreCategories={showExploreCategories}
      showSeachIcon={showSearchIcon}
      showMarketingBanners={
        !isEmpty(marketingBanners) && kycData.isReadyToInvestBase
      }
      showApplyReferral={showApplyReferral}
      showShareReferral={showShareReferral}
      showSetupEasySip={showSetupEasySip}
      showKycCard={kycData.showKycCard}
      referralData={referralData}
      shareReferralData={shareReferralData}
      kycBottomsheetData={kycBottomsheetData}
      bottomsheetStates={bottomsheetStates}
      authData={contactDetails}
      campaignData={campaignData}
      referral={referral}
      handlePremiumOnboarding={handlePremiumOnboarding}
      handleReferralChange={handleReferralChange}
      closeBottomsheet={closeBottomsheet}
      handleReferralBottomsheet={handleReferralBottomsheet}
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
      handleAuthVerification={handleAuthVerification}
      handleAuthEdit={handleAuthEdit}
      onCampaignPrimaryClick={handleCampaign({
        campaignData,
        handleLoader,
        handleBottomsheets,
        sendEvents,
      })}
      closeCampaignDialog={closeCampaignDialog({
        campaignData,
        handleBottomsheets,
        sendEvents,
      })}
      handleKycPrimaryClick={handleKycStatus({
        kyc,
        kycData,
        modalData: kycBottomsheetData,
        navigate,
        updateKyc,
        closeKycStatusDialog: closeBottomsheet(
          BOTTOMSHEET_KEYS.openKycStatusDialog,
          kycBottomsheetData.title,
          true
        ),
        handleLoader,
        sendEvents,
      })}
      handleKycSecondaryClick={handleKycStatusRedirection(
        {
          kyc,
          user,
          kycData,
          modalData: kycBottomsheetData,
          baseConfig,
          contactDetails,
          navigate,
          sendEvents,
          handleLoader,
          handleDialogStates: handleBottomsheets,
          closeKycStatusDialog: closeBottomsheet(
            BOTTOMSHEET_KEYS.openKycStatusDialog,
            kycBottomsheetData.title,
            true
          ),
        },
        props
      )}
    />
  );
};

export default landingContainer(Landing);
