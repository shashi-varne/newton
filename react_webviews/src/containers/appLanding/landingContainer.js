import React, { useEffect, useMemo, useState } from "react";
import Landing from "../../pages/AppLanding/Landing";
import { getConfig, navigate as navigateFunc } from "../../utils/functions";
import {
  EXPLORE_CATEGORIES,
  MANAGE_INVESTMENTS,
  REFERRAL_DATA,
  AUTH_VERIFICATION_DATA,
  BOTTOMSHEET_KEYS,
  APPSTORAGE_KEYS,
  CAMPAIGNS_TO_SHOW_ON_PRIORITY,
} from "../../constants/webappLanding";
import { nativeCallback } from "../../utils/native_callback";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummary,
  getAppData,
  setKyc,
  setUser,
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
  getContactVerification,
  getKycBottomsheetData,
  handleCampaign,
  closeCampaignDialog,
} from "../../business/appLanding/helper";
import { WEBAPP_LANDING_PATHNAME_MAPPER } from "../../constants/webappLanding";
import {
  getCampaignData,
  getKycData,
  handleKycStatus,
  handleKycStatusRedirection,
  handleStocksAndIpoCards,
  openKyc,
} from "../../dashboard/Invest/functions";
import { storageService } from "../../utils/validators";
import { isEmpty } from "lodash-es";
import {
  applyReferralCode,
  authVerification,
  generateOtp,
} from "businesslogic/apis/app";
import ToastMessage from "../../designSystem/atoms/ToastMessage";

const screen = "LANDING";
const portfolioOverViewData = {
  currentValue: "₹19.6Cr",
  investedValue: "₹3.5Cr",
  profitOrLoss: "+ ₹1.2Cr",
  isProfit: true,
};

const DEFAULT_BOTTOMSHEETS_DATA = {
  openKycStatusDialog: false,
  openReferral: false,
  openAuthVerification: false,
  openAccountAlreadyExists: false,
  openPremiumOnboarding: false,
  openCampaign: false,
};

const signifierKey = "stocks";

const initializeData = () => {
  const {
    code,
    investSections,
    mfOptions,
    onboardingCarousels,
    platformMotivators,
    landingMarketingBanners,
    ...baseConfig
  } = getConfig();
  const { investCardsData, isMfOnly, showPortfolioOverview } =
    getInvestCardsData(investSections, signifierKey, mfOptions);
  const marketingBanners = getEnabledMarketingBanners(landingMarketingBanners);
  return {
    code,
    onboardingCarousels,
    platformMotivators,
    marketingBanners,
    investCardsData,
    isMfOnly,
    showPortfolioOverview,
    baseConfig,
  };
};

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
  const { kyc, user, appStorage, partner } = useSelector(getAppData);
  const {
    code,
    onboardingCarousels,
    platformMotivators,
    marketingBanners,
    baseConfig,
    investCardsData,
    isMfOnly,
    showPortfolioOverview,
  } = useMemo(initializeData, [partner]);
  const [kycData, setKycData] = useState(getKycData(kyc, user));
  const [campaignData, setCampaignData] = useState({});
  const [referral, setReferral] = useState("");
  const [contactDetails, setContactDetails] = useState({});
  const [showCarousals, setShowCarousals] = useState(
    !isEmpty(onboardingCarousels) &&
      !kycData.isReadyToInvestBase &&
      !appStorage.isOnboardingCarouselsDisplayed
  );
  const [kycBottomsheetData, setKycBottomsheetData] = useState({});

  const getReferalData = () => {
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

  const { showApplyReferral, showShareReferral } = useMemo(getReferalData, [
    user,
    partner,
  ]);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = () => {
    const sagaCallback = (response, data) => {
      setSummaryData(response);
      const kycDetails = getKycData(data.kyc, data.user);
      setKycData(kycDetails);
      if (!isEmpty(data.bankList)) {
        navigate(WEBAPP_LANDING_PATHNAME_MAPPER.bankList);
      } else {
        handleLandingBottomsheets(kycDetails);
      }
    };
    dispatch(fetchSummary({ Api, screen, sagaCallback }));
  };

  const handleLandingBottomsheets = (kycDetails) => {
    let campaignBottomSheetData = {},
      bottomsheetData = {};
    const contactData = getContactVerification(kycDetails.kyc, false, screen);
    setContactDetails(contactData);

    if (!appStorage.isCampaignDisplayed) {
      campaignBottomSheetData = getCampaignData();
      setCampaignData(campaignBottomSheetData);
    }
    if (
      !appStorage.isKycBottomsheetDisplayed ||
      !appStorage.isPremiumBottomsheetDisplayed
    ) {
      bottomsheetData = getKycBottomsheetData(kycDetails, appStorage, code);
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

  const closeBottomsheet =
    (key, intent) =>
    (outsideClick = false) => {
      handleBottomsheets({ [key]: false });
      sendEvents("back", {
        eventName: "bottom_sheet",
        intent,
        outsideClick,
      });
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
    if (data.intent) {
      eventObj.event_name = "bottom_sheet";
      eventObj.properties.intent = data.intent;
      eventObj.properties.outside_click = !!data.outsideClick;
    }
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  const handleSummaryData = (data) => {
    dispatch(setKyc(data.kyc));
    dispatch(setUser(data.user));
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
          closeKycStatusDialog: closeBottomsheet(
            BOTTOMSHEET_KEYS.openKycStatusDialog
          ),
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

    if (showApplyReferral) {
      applyReferral();
    } else {
      navigate(WEBAPP_LANDING_PATHNAME_MAPPER.refer);
    }
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
      ToastMessage("You have applied referral code successfully");
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      handleLoader({ dotLoader: false });
    }
  };

  return (
    <WrappedComponent
      isPageLoading={isPageLoading}
      loaderData={loaderData}
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
      showPortfolioOverview={
        showPortfolioOverview && kycData.isReadyToInvestBase
      }
      showPlatformMotivators={!kycData.isReadyToInvestBase}
      showExploreCategories={isMfOnly}
      showSeachIcon={isMfOnly}
      showMarketingBanners={
        !showPortfolioOverview && kycData.isReadyToInvestBase
      }
      showMarketingBannersAtBottom={
        showPortfolioOverview && kycData.isReadyToInvestBase
      }
      showApplyReferral={showApplyReferral}
      showShareReferral={showShareReferral}
      showSetupEasySip={true}
      showKycCard={kycData.showKycCard}
      referralData={REFERRAL_DATA.success}
      kycBottomsheetData={kycBottomsheetData}
      bottomsheetStates={bottomsheetStates}
      authData={contactDetails}
      campaignData={campaignData}
      referral={referral}
      handleReferralChange={handleReferralChange}
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
      handleAuthVerification={handleAuthVerification}
      handleAuthEdit={handleAuthEdit}
      onCampaignPrimaryClick={handleCampaign({
        campaignData,
        handleLoader,
        handleBottomsheets,
      })}
      closeCampaignDialog={closeCampaignDialog({
        campaignData,
        handleBottomsheets,
      })}
      handleKycPrimaryClick={handleKycStatus({
        kyc,
        kycData,
        modalData: kycBottomsheetData,
        navigate,
        updateKyc,
        closeKycStatusDialog: closeBottomsheet(
          BOTTOMSHEET_KEYS.openKycStatusDialog,
          kycBottomsheetData.title
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
          handleLoader,
          handleSummaryData,
          handleDialogStates: handleBottomsheets,
        },
        props
      )}
    />
  );
};

export default landingContainer(Landing);
