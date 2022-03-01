import Api from "utils/api";
import { storageService, splitMobileNumberFromContryCode } from "../../utils/validators";
import toast from "../../common/ui/Toast";
import { getConfig, getBasePath, isTradingEnabled, getInvestCards } from "../../utils/functions";
import {
  investCardsBase,
  kycStatusMapper,
  kycStatusMapperInvest,
  premiumBottomSheetMapper,
  sdkInvestCardMapper
} from "./constants";
import { getAccountSummary, getKycAppStatus, isReadyToInvest, setKycProductType, setSummaryData } from "../../kyc/services";
import { get_recommended_funds } from "./common/api";
import { PATHNAME_MAPPER as KYC_PATHNAME_MAPPER } from "../../kyc/constants";
import { isEquityCompleted } from "../../kyc/common/functions";
import { nativeCallback, openModule } from "../../utils/native_callback";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import { getCorpusValue } from "./common/commonFunctions";

let errorMessage = "Something went wrong!";
export async function initialize({ screenName, kyc, user, handleLoader, handleSummaryData }) {
  const config = getConfig();
  let dataSettedInsideBoot = storageService().get("dataSettedInsideBoot");
  const openEquityCallback = storageService().getBoolean("openEquityCallback");
  if (openEquityCallback) {
    storageService().setBoolean("openEquityCallback", false);
    nativeCallback({
      action: "open_equity"
    })
  }
  if (["investLanding", "sdkLanding"].includes(screenName) && dataSettedInsideBoot) {
    storageService().set("dataSettedInsideBoot", false);
  }
  const isBfdlBannerDisplayed = storageService().getBoolean("bfdlBannerDisplayed");
  const isBfdlConfig = !isBfdlBannerDisplayed && config.code === 'bfdlmobile' && (config.isIframe || config.isSdk)
  const isWebConfig = config.Web && screenName === "investLanding";
  const isSdkConfig = config.isSdk && screenName === "sdkLanding";

  let data = { kyc, user }
  if (!isBfdlConfig && (isWebConfig || isSdkConfig) && !dataSettedInsideBoot) {
    data = await getSummary({ handleLoader, handleSummaryData });
  }
  return data;
}

export async function getSummary({ handleLoader, handleSummaryData }) {
  let kyc = storageService().getObject("kyc") || {};
  let user = storageService().getObject("user") || {};
  if(isEmpty(user) || isEmpty(kyc)) {
    handleLoader({ skelton: true });
  } else {
    handleLoader({ kycStatusLoader: true });
  }
  try {
    const result = await getAccountSummary();
    setSummaryData(result);
    user = result.data.user.user.data;
    kyc = result.data.kyc.kyc.data;
    const subscriptionStatus = result?.data?.equity?.subscription_status?.data || {};
    if(isFunction(handleSummaryData)) {
      handleSummaryData({ kyc, user, subscriptionStatus })
    }
  } catch (error) {
    console.log(error);
    toast(error.message || errorMessage);
  } finally {
    handleLoader({ skelton: false, kycStatusLoader: false });
  }
  return { kyc, user }
}

export function getInvestCardsData() {
  const config = getConfig();
  const disabledPartnersMap = {
    insurance: [
      "cccb",
      "sury",
      "obc",
      "svcho",
      "alb",
      "ktb",
      "sbm",
      "cub",
    ],
    nps: ["cccb", "sury", "obc", "svcho", "ktb", "sbm"],
    gold: ["apna", "cccb", "sury", "obc", "svcho", "alb", "ktb"],
  };

  const referralData = storageService().getObject("referral") || {};
  let subbrokerCode = "";
  if (referralData?.subbroker?.data) {
    subbrokerCode = referralData.subbroker.data.subbroker_code;
  }

  if (config.code === "bfdlmobile") {
    investCardsBase["ourRecommendations"]["instaredeem"].title = "Money +";
  }

  let cardsData = {}; // stores card data to display
  const { investSections, investSubSectionMap } = config;

  for (let section of investSections) {
    const subSections = investSubSectionMap[section] || [];
    if (subSections.length > 0) {
      cardsData[section] = [];
      for (let subSection of subSections) {
        if (
          subbrokerCode &&
          ["insurance", "nps", "gold"].includes(subSection) &&
          disabledPartnersMap[subSection].includes(subbrokerCode)
        ) {
          continue;
        }
        let cardData = investCardsBase[section][subSection];
        if (!isEmpty(cardData)) {
          cardData.key = subSection;
          cardsData[section].push(cardData);
        }
      }
    }
  }
  return { cardsData, investSections }
}

export async function getRecommendationsAndNavigate({ amount, handleLoader, navigate }) {
  const params = {
    investType: "buildwealth",
    term: 5,
    amount: amount,
  };

  handleLoader({ skelton: true })

  try {
    const { recommendation } = await get_recommended_funds(params);
    
    storageService().setObject("funnelReturnRates", {
      stockReturns: recommendation.expected_return_eq,
      bondReturns: recommendation.expected_return_debt
    });

    const funnelData = {
      recommendation: recommendation,
      amount: params.amount,
      term: params.term,
      // eslint-disable-next-line
      year: parseInt(new Date().getFullYear() + params.term),
      corpus: getCorpusValue(recommendation.equity, params.amount, true, params.term),
      investType: params.investType,
      investTypeDisplay: "sip",
      name: "Wealth building",
      isSliderEditable: recommendation.editable,
      equity: recommendation.equity,
      debt: recommendation.debt,
      graphType: params.investType,
    };
    storageService().setObject("funnelData", funnelData);
    storageService().setObject("funnelGoalData", recommendation.goal);
    
    if (amount === 300) {
      navigate(`/invest/buildwealth/amount`);
    } else {
      getRecommendations({ ...funnelData, navigate, handleLoader });
    }
  } catch (error) {
    console.log(error);
    handleLoader({ skelton: false })
    toast(errorMessage);
  }
}

export async function getRecommendations({
  amount,
  investType,
  term,
  equity,
  debt,
  investName,
  investTypeDisplay,
  navigate,
  handleLoader,
}) {
  const config = getConfig();
  try {
    const result = await get_recommended_funds({
      type: investType,
      amount: amount,
      term: term,
      equity: equity,
      debt: debt,
      rp_enabled: config.riskEnabledFunnels
    });

    if (!result.recommendation) {
      // RP enabled flow, when user has no risk profile
      storageService().remove('userSelectedRisk');
      if (result.msg_code === 0) {
        navigate(`/invest/${investType}/risk-select`);
      } else if (result.msg_code === 1) {
        navigate(`/invest/${investType}/risk-select-skippable`);
      }
      return;
    }

    const funnelData = {
      term,
      investType,
      name: investName,
      graphType: investType,
      investTypeDisplay: investTypeDisplay,
      showRecommendationTopCards: true,
      ...result
    };
    storageService().setObject("funnelData", funnelData);
    storageService().set("userSelectedRisk", result.rp_indicator);

    navigate("/invest/recommendations");
  } catch (error) {
    console.log(error);
    handleLoader({ skelton: false })
    toast(errorMessage);
  }
}

export const getKycData = (kyc, user) => {
  kyc = kyc || storageService().getObject("kyc") || {};
  const TRADING_ENABLED = isTradingEnabled(kyc);
  user = user || storageService().getObject("user") || {};
  const isCompliant = kyc.kyc_status === "compliant";
  const kycJourneyStatus = getKycAppStatus(kyc)?.status || "";
  let kycStatusData = kycStatusMapperInvest[kycJourneyStatus];
  const initialKycStatus = ["init", "ground"];
  if(initialKycStatus.includes(kycJourneyStatus) && TRADING_ENABLED) {
    kycStatusData.subtitle = "Set up Trading & Demat A/c. now";
  } 
  if (isCompliant && !TRADING_ENABLED) {
    if (["init", "incomplete"].indexOf(kycJourneyStatus) !== -1) {
      kycStatusData = kycStatusMapperInvest["ground_premium"];
    }
  } else if (isCompliant && TRADING_ENABLED) {
    // need not to show premium onboarding info to trading customers
    if (kycJourneyStatus === "ground_premium") {
      kycStatusData = kycStatusMapperInvest["incomplete"];
    }
  }
  const isReadyToInvestBase = isReadyToInvest();
  const isEquityCompletedBase = isEquityCompleted();
  let kycJourneyStatusMapperData = kycJourneyStatus?.includes("ground_") ? kycStatusMapper["incomplete"] : kycStatusMapper[kycJourneyStatus];
  const isKycCompleted = (TRADING_ENABLED && isEquityCompletedBase) || (!TRADING_ENABLED && isReadyToInvestBase);
  const showKycCard = !isKycCompleted || (TRADING_ENABLED && isEquityCompletedBase && kycJourneyStatus === "fno_rejected")
  const kycData = {
    isCompliant,
    kycStatusData,
    kycJourneyStatusMapperData,
    kyc,
    user,
    kycJourneyStatus,
    isReadyToInvestBase,
    isEquityCompletedBase,
    tradingEnabled: TRADING_ENABLED,
    isKycCompleted,
    showKycCard,
    isKycStatusDialogDisplayed: false,
    isPremiumBottomsheetDisplayed: false,
  };
  return kycData;
}

export const initializeKyc = ({ user, kyc, partnerCode, screenName, handleDialogStates }) => {
  let kycData = getKycData(kyc, user);
  const { 
    isCompliant,
    kycJourneyStatus,
    tradingEnabled,
  } = kycData;
  const contactDetails = contactVerification(kyc, handleDialogStates, screenName);
  if (contactDetails.isVerifyDetailsSheetDisplayed) {
    return { kycData, contactDetails };
  }
  let premiumDialogData = {};
  let premiumOnboardingStatus = "";
  if (isCompliant && !tradingEnabled) {
    premiumOnboardingStatus = kycJourneyStatus;
    if (
      ["ground_premium", "init", "incomplete"].includes(kycJourneyStatus)
    ) {
      premiumDialogData = premiumBottomSheetMapper[premiumOnboardingStatus];
      premiumDialogData.status = premiumOnboardingStatus;
    }

    if (
      ["submitted", "complete"].includes(kycJourneyStatus) &&
      !user.active_investment &&
      kyc.bank.meta_data_status === "approved"
    ) {
      premiumDialogData = kycStatusMapper["mf_complete"];
      premiumDialogData.status = premiumOnboardingStatus;
    }

    if (premiumOnboardingStatus && !isEmpty(premiumDialogData)) {
      let banklist = storageService().getObject("banklist");
      if (isEmpty(banklist) || partnerCode === "moneycontrol") {
        return { kycData, contactDetails };
      } else {
        const isPremiumBottomsheetDisplayed = openPremiumOnboardBottomSheet({
          premiumDialogData,
          screenName,
          handleDialogStates
        });
        kycData.isPremiumBottomsheetDisplayed = isPremiumBottomsheetDisplayed;
      }
    }
  } else {
    let modalData = {}
    const kycStatusesToShowDialog = ["verifying_trading_account", "complete", "fno_rejected", "esign_pending"];
    let isLandingBottomSheetDisplayed = storageService().get("landingBottomSheetDisplayed");
    if (kycStatusesToShowDialog.includes(kycJourneyStatus)) {
      if (isLandingBottomSheetDisplayed) {
        return { kycData, contactDetails };
      }
  
      if (["fno_rejected", "complete"].includes(kycJourneyStatus)) {
        if (tradingEnabled && kyc.equity_investment_ready && user.equity_status === "init") {
          modalData = kycStatusMapper["kyc_verified"];
        } else if (!tradingEnabled && !isCompliant && !user.active_investment) {
          modalData = kycStatusMapper["mf_complete"];
        }
      } else {
        modalData = kycStatusMapper[kycJourneyStatus];
      }
    }
    
    if (!isEmpty(modalData)) {
      if (kycStatusesToShowDialog.includes(kycJourneyStatus)) {
        storageService().set("landingBottomSheetDisplayed", true);
      }
  
      if (!modalData.dualButton) {
        modalData.oneButton = true;
      }
      kycData.isKycStatusDialogDisplayed = true
      handleDialogStates({ openKycStatusDialog: true }, modalData)
    }
  }

  return { kycData, contactDetails }
}

export const handleKycAndCampaign = ({
  kyc,
  user,
  screenName,
  isWeb,
  partnerCode,
  handleDialogStates,
  setKycData,
  setContactDetails,
  setCampaignData,
}) => {
  const { kycData: kycDetails, contactDetails: contactData } = initializeKyc({
    kyc,
    user,
    partnerCode,
    screenName,
    handleDialogStates,
  });

  setKycData(kycDetails);
  if (isFunction(setContactDetails)) {
    setContactDetails(contactData);
  }
  const {
    tradingEnabled,
    isKycStatusDialogDisplayed,
    isPremiumBottomsheetDisplayed,
  } = kycDetails;

  const campaignBottomSheetData = getCampaignData();
  setCampaignData(campaignBottomSheetData);
  const isCampaignDialogDisplayed = storageService().get(
    "isCampaignDialogDisplayed"
  );
  const campaignsToShowOnPriority = ["trading_restriction_campaign"];
  const isPriorityCampaign = campaignsToShowOnPriority.includes(
    campaignBottomSheetData.campaign_name
  );
  const isActiveBottomSheet =
    contactData.isVerifyDetailsSheetDisplayed ||
    isPremiumBottomsheetDisplayed ||
    isKycStatusDialogDisplayed;
  if (
    !isCampaignDialogDisplayed &&
    isWeb &&
    ((tradingEnabled && isPriorityCampaign) || !isActiveBottomSheet)
  ) {
    handleCampaignNotification({
      campaignData: campaignBottomSheetData,
      handleDialogStates,
    });
  }
};

export function openPremiumOnboardBottomSheet({ premiumDialogData, screenName, handleDialogStates }) {
  const config = getConfig()
  let isKycPremiumBottomSheetDisplayed = storageService().getBoolean(
    "isKycPremiumBottomSheetDisplayed"
  );

  if (isKycPremiumBottomSheetDisplayed || 
      (config.Web && screenName !== "investLanding") || 
      (!config.Web && screenName !== "sdkLanding")) {
    return false;
  }

  storageService().setBoolean("isKycPremiumBottomSheetDisplayed", true);
  handleDialogStates({ openKycPremiumLanding: true }, premiumDialogData)
  return true;
}

export function handleKycSubmittedOrRejectedState({ kycJourneyStatusMapperData, handleDialogStates }) {
  let modalData = Object.assign({ key: "kyc" }, kycJourneyStatusMapperData);
  if(!modalData.dualButton) {
    modalData.oneButton = true;
  }
  handleDialogStates({ openKycStatusDialog: true }, modalData);
}

export async function openKyc({
  kyc,
  kycJourneyStatus,
  kycJourneyStatusMapperData,
  tradingEnabled,
  kycStatusData,
  handleDialogStates,
  handleLoader,
  navigate,
  updateKyc,
}) {
  const kycStatusesToShowDialog = [
    "submitted",
    "rejected",
    "fno_rejected",
    "esign_pending",
    "verifying_trading_account",
  ];
  if (kycStatusesToShowDialog.includes(kycJourneyStatus)) {
    handleKycSubmittedOrRejectedState({
      kycJourneyStatusMapperData,
      handleDialogStates,
    });
  } else {
    handleCommonKycRedirections({
      kyc,
      kycJourneyStatus,
      tradingEnabled,
      kycStatusData,
      handleLoader,
      navigate,
      updateKyc,
    });
  }
}

export async function handleCommonKycRedirections({
  kyc,
  kycJourneyStatus,
  tradingEnabled,
  kycStatusData,
  isReadyToInvestBase,
  navigate,
  handleLoader,
  updateKyc,
}) {
  if (kycJourneyStatus === "ground") {
    navigate("/kyc/home");
  } else if (kycJourneyStatus === "ground_pan") {
    navigate("/kyc/journey", {
      state: {
        show_aadhaar: !(kyc.address.meta_data.is_nri || kyc.kyc_type === "manual") ? true : false,
      },
    });
  } else if (!tradingEnabled && kycJourneyStatus === "complete") {
    navigate(KYC_PATHNAME_MAPPER.kycEsignNsdl, {
      searchParams: `${getConfig().searchParams}&status=success`
    });
  } else if (tradingEnabled && kyc?.kyc_product_type !== "equity") {
    await setKycProductTypeAndRedirect({ kyc, kycJourneyStatus, isReadyToInvestBase, handleLoader, navigate, updateKyc });
  } else if (kycStatusData.nextState) {
    navigate(kycStatusData.nextState);
  } else {
    navigate(KYC_PATHNAME_MAPPER.journey);
  }
}

export async function setKycProductTypeAndRedirect({ kyc, kycJourneyStatus, isReadyToInvestBase, handleLoader, navigate, updateKyc }) {
  const config = getConfig();
  let result;
  if (!kyc?.mf_kyc_processed) {
    result = await setProductType(handleLoader);
    updateKyc(result.kyc);
  }
  
  // already kyc done users
  if (isReadyToInvestBase && (result?.kyc?.mf_kyc_processed || kyc?.mf_kyc_processed)) {
    navigate(KYC_PATHNAME_MAPPER.tradingInfo)
  } else if (kycJourneyStatus === "ground") {
    navigate("/kyc/home");
  } else {
    const showAadhaar = !(result?.kyc?.address.meta_data.is_nri || result?.kyc?.kyc_type === "manual");
    if (result?.kyc?.kyc_status !== "compliant") {
      navigate(KYC_PATHNAME_MAPPER.journey, {
        searchParams: `${config.searchParams}&show_aadhaar=${showAadhaar}`
      });
    } else {
      navigate(KYC_PATHNAME_MAPPER.journey)
    }
  }
}

export function handleIpoCardRedirection({ kyc, user, isDirectEntry, navigate, handleLoader, handleSummaryData, handleDialogStates }, props) {
  if (
      kyc.equity_investment_ready &&
      user?.pin_status !== 'pin_setup_complete'
  ) {
    initiatePinSetup({ key: "ipo", isDirectEntry, navigate, handleLoader, handleSummaryData, handleDialogStates }, props);
  } else {
    navigate("/market-products");
  }
}

function initiatePinSetup({ key, isDirectEntry, navigate, handleLoader, handleSummaryData, handleDialogStates }, props) {
  const config  = getConfig();
  if (config.isNative) {
    openModule('account/setup_2fa', props, { routeUrlParams: `/${key}` });
    nativeCallback({ action: 'exit_web' });
  } else if (config.isSdk) {
    window.callbackWeb["open_2fa_module"]({
      operation: "setup_pin",
      request_code: "REQ_SETUP_2FA",
      callback: async function (data) {
        if (data.status === "success") {
          await getSummary({ handleLoader, handleSummaryData });
          handleStocksRedirection({ isDirectEntry, navigate });
        }
      },
    });
  } else {
    handleDialogStates({ openPinSetupDialog: true, cardKey: key })
  }
}

export function handleStocksAndIpoCards(
  {
    key,
    kycJourneyStatusMapperData,
    kycJourneyStatus,
    isDirectEntry = false,
    kyc,
    user,
    handleDialogStates,
    handleSummaryData,
    navigate,
    handleLoader,
    closeKycStatusDialog,
  },
  props
) {
  const config = getConfig();
  let modalData = Object.assign({key}, kycJourneyStatusMapperData);

  if (key === "ipo") {
    const handleClick = () => {
      handleIpoCardRedirection({ kyc, user, isDirectEntry, navigate, handleLoader, handleSummaryData, handleDialogStates }, props)
    }
    if (kycJourneyStatus === "verifying_trading_account") {
      modalData = {
        ...modalData,
        subtitle: "This process could take upto 48 hours. We will notify you once it’s done. Meanwhile, you can explore primary market products",
        buttonTitle: "CONTINUE",
        handleClick: handleClick
      }
    } else if (kycJourneyStatus === "submitted") {
      modalData = {
        ...modalData,
        buttonTitle: "CONTINUE",
        handleClick: handleClick
      }
    } else if (
      kyc.equity_investment_ready ||
      (kycJourneyStatus === "complete" && kyc.kyc_product_type === 'equity') ||
      kycJourneyStatus === "fno_rejected"
    ) {
      handleIpoCardRedirection({ kyc, user, isDirectEntry, navigate, handleLoader, handleSummaryData, handleDialogStates }, props);
      return
    }
  } else if (key === "stocks") {
    if (
      kyc.equity_investment_ready ||
      (kycJourneyStatus === "complete" && kyc.kyc_product_type === 'equity')
    ) {
      if (user?.pin_status !== 'pin_setup_complete') {
        return initiatePinSetup({ key, isDirectEntry, navigate, handleSummaryData, handleLoader, handleDialogStates }, props);
      } else if (kycJourneyStatus !== "fno_rejected") {
        if(config.isSdk) {
          handleStocksRedirection({ isDirectEntry, navigate })
        } else {
          handleLoader({ pageLoader: "page" })
          window.location.href = `${config.base_url}/page/equity/launchapp`;
        }
        return;
      } 
    }
  }
  if(key === "stocks" && !modalData.dualButton) {
    const kycInprogressStates = ["submitted", "verifying_trading_account"];
    if (config.isSdk && kycInprogressStates.includes(kycJourneyStatus)) {
      const handleClick = () => {
        closeKycStatusDialog(true)
        handleStocksRedirection({ isDirectEntry, navigate });
      }
      modalData.buttonTitle = "CONTINUE";
      modalData.handleClick = handleClick
    }
    if (config.isSdk && !modalData.oneButton) {
      modalData.dualButton = true;
    } else {
      modalData.oneButton = true
    }
  }

  if (!isEmpty(modalData) && (kycJourneyStatus !== "complete" || (kycJourneyStatus === "complete" && kyc.kyc_product_type !== "equity"))) {
    handleDialogStates({ openKycStatusDialog: true }, modalData)
  }
}

export const handleStocksRedirection = ({ isDirectEntry = false, navigate }) => {
  if (isDirectEntry) {
    storageService().setBoolean("openEquityCallback", true);
    navigate("/invest")
  } else {
    nativeCallback({
      action: "open_equity"
    })
  }
}

export const handleKycPremiumLanding = ({
  screenName,
  modalData,
  navigate,
  handleDialogStates,
}) => () => {
  if (
    (screenName === "investLanding" && modalData.nextState === "/invest") ||
    isEmpty(modalData.nextState)
  ) {
    handleDialogStates({ openKycPremiumLanding: false });
    return;
  }
  navigate(modalData.nextState);
};

export const handleKycStatus = ({
  kyc,
  kycData,
  modalData,
  closeKycStatusDialog,
  navigate,
  handleLoader,
  updateKyc,
  sendEvents,
}) => async () => {
  if (isFunction(sendEvents)) {
    sendEvents("next", "kyc_bottom_sheet");
  }
  const { kycJourneyStatus, tradingEnabled, isReadyToInvestBase } = kycData;
  if (
    ["submitted", "verifying_trading_account"].includes(kycJourneyStatus) ||
    (kycJourneyStatus === "complete" && kyc.mf_kyc_processed)
  ) {
    closeKycStatusDialog();
  } else if (kycJourneyStatus === "rejected") {
    navigate(KYC_PATHNAME_MAPPER.uploadProgress);
  } else if (tradingEnabled && kyc?.kyc_product_type !== "equity") {
    closeKycStatusDialog(true);
    await setKycProductTypeAndRedirect({
      kyc,
      kycJourneyStatus,
      isReadyToInvestBase,
      handleLoader,
      navigate,
      updateKyc,
    });
  } else if (kycJourneyStatus === "ground_pan") {
    navigate("/kyc/journey", {
      state: {
        show_aadhaar: !(
          kyc.address.meta_data.is_nri || kyc.kyc_type === "manual"
        ),
      },
    });
  } else if (modalData.nextState && modalData.nextState !== "/invest") {
    navigate(modalData.nextState);
  } else {
    closeKycStatusDialog();
  }
};

export const handleKycStatusRedirection = (
  {
    kyc,
    user,
    kycData,
    modalData,
    baseConfig,
    contactDetails,
    isDirectEntry = false,
    closeKycStatusDialog,
    navigate,
    handleLoader,
    handleSummaryData,
    handleDialogStates,
  },
  props
) => () => {
  let { kycJourneyStatus } = kycData;
  const {
    contactValue,
    communicationType,
    contactNotVerified,
  } = contactDetails;
  if (modalData.key === "kyc") {
    if (kycJourneyStatus === "fno_rejected") {
      closeKycStatusDialog();
    }
  } else if (modalData.key === "ipo") {
    if (contactNotVerified) {
      storageService().set("ipoContactNotVerified", true);
      navigate("/secondary-verification", {
        state: {
          communicationType,
          contactValue,
          isDirectEntry
        },
      });
      return;
    }
    handleIpoCardRedirection(
      {
        kyc,
        user,
        isDirectEntry,
        navigate,
        handleLoader,
        handleSummaryData,
        handleDialogStates,
      },
      props
    );
  } else {
    if (baseConfig.isSdk) {
      if (contactNotVerified) {
        storageService().setBoolean("sdkStocksRedirection", true);
        navigate("/secondary-verification", {
          state: {
            communicationType,
            contactValue,
            isDirectEntry
          },
        });
        return;
      }
      closeKycStatusDialog(true);
      handleStocksRedirection({ isDirectEntry, navigate })
      return;
    } else if (kycJourneyStatus === "fno_rejected") {
      handleLoader({ pageLoader: "page" });
      window.location.href = `${baseConfig.base_url}/page/equity/launchapp`;
    }
    closeKycStatusDialog();
  }
};

async function setProductType(handleLoader) {
  handleLoader({ skelton: true });
  try {
    const payload = {
      "kyc":{},
      "set_kyc_product_type": "equity"
    }
    const result = await setKycProductType(payload);
    return result;
  } catch (err) {
    console.log(err.message);
    toast(err.message)
  } finally {
    handleLoader({ skelton: false });
  }
}

export const resetRiskProfileJourney = () => {
  storageService().set("came_from_risk_webview", "");
  storageService().set("firsttime_from_risk_webview_invest", "");
  return;
};

function handleInvestSubtitle (isEquityEnabled)  {
  const investCards = getInvestCards(["nps", "gold"]);
  let investCardSubtitle = 'Mutual funds, Save tax';

  if (isEquityEnabled) {
    investCardSubtitle = 'Stocks, F&O, IPOs, Mutual funds, Save tax';
  }

  // if (investCards?.gold) {
  //   investCardSubtitle = investCardSubtitle += ', Gold, Save tax';
  // } else {
  //  investCardSubtitle = 'Mutual funds, Save tax';
  // }

  if (investCards?.nps) {
    investCardSubtitle = investCardSubtitle += ', NPS';
  }
  return investCardSubtitle;
};

export function getSdkLandingCardsData({ kyc, user }) {
  kyc = kyc || storageService().getObject("kyc") || {};
  user = user || storageService().getObject("user") || {};
  const config = getConfig();
  const isWeb = config.Web;
  const hideReferral = user.active_investment && !isWeb && config?.referralConfig?.shareRefferal;
  const referralCode = !user.active_investment && !isWeb && config?.referralConfig?.applyRefferal;
  const isEquityEnabled = isTradingEnabled(kyc);
  const cards = sdkInvestCardMapper.filter(el => {
    if(el.key === 'refer') {
      if(referralCode){
        el.referralCode = true;
        el.title = "Referral code"
        el.path = "";
        return referralCode;
      } else {
        return hideReferral;
      }
    } else {
      if(el.key === 'invest') {
        el.subtitle = handleInvestSubtitle(isEquityEnabled);
        el.tagTitle = isEquityEnabled ? 'NEW' : '';
      }
      return true;
    }
  })
  return cards;
}

// this function sets campaign data
export function getCampaignData () {
  const notifications = storageService().getObject('campaign') || [];
  const campaignData = notifications.reduceRight((acc, data) => {
    const target = data?.notification_visual_data?.target;
    if (target?.length >= 1) {
      // eslint-disable-next-line no-unused-expressions
      target.some((el, idx) => {
        if (el?.view_type === 'bottom_sheet_dialog' && el?.section === 'landing') {
          acc = el;
          acc.campaign_name = data?.campaign?.name;
          return true;
        }
        return false;
      });
    }
    return acc;
  }, {});
  return campaignData;
};

export function handleCampaignNotification ({ campaignData, handleDialogStates }) {
  if (!isEmpty(campaignData)) {
    storageService().set('isCampaignDialogDisplayed', true);
    const campaignsToShowOnPriority = ["trading_restriction_campaign"];
    let dialogStates = { openCampaignDialog: true } 
    if (campaignsToShowOnPriority.includes(campaignData.campaign_name)) {
      dialogStates = {
        openCampaignDialog: true,
        openKycPremiumLanding: false,
        openKycStatusDialog: false,
        verifyDetails: false,
      }
    }
    handleDialogStates(dialogStates);
  }
}

export function contactVerification(kyc, handleDialogStates, screenName) {
  let contactData = {}
  const contactDetails = kyc?.identification?.meta_data;
  // ---------------- IPO Contact Verification Setting state for BottomSheet---------------//
  if (!isEmpty(contactDetails)) {
    if (contactDetails.mobile_number_verified === false) {
      const contactValue = splitMobileNumberFromContryCode(contactDetails?.mobile_number)
      contactData = {
        communicationType: "mobile",
        contactValue,
        contactNotVerified: true,
      }
    }
  }
  // ---------------- Above Condition For IPO Contact Verification---------------//
  const isVerifyDetailsSheetDisplayed = storageService().get("verifyDetailsSheetDisplayed");
  if (!isVerifyDetailsSheetDisplayed && screenName === "investLanding") {
    if (!isEmpty(contactDetails)) {
      let contact_type, contact_value, isVerified = true;
      if (!isEmpty(contactDetails.mobile_number) && contactDetails.mobile_number_verified === false) {
        contact_type = "mobile";
        isVerified = false
        contact_value = splitMobileNumberFromContryCode(contactDetails?.mobile_number)
      } else if (!isEmpty(contactDetails.email) && contactDetails.email_verified === false) {
        contact_type = "email";
        contact_value = contactDetails.email
        isVerified = false;
      }
      if (!isVerified) {
          //openKycPremiumLanding, openCampaignDialog, openKycStatusDialog are Onload bottomSheet
          //Which Are Disable As contactVerification Takes highest priority.
          handleDialogStates({
            openKycPremiumLanding: false,
            openCampaignDialog: false,
            openKycStatusDialog: false,
            verifyDetails: true,
          });
          contactData = {
            ...contactData,
            contact_type,
            contact_value,
            isVerifyDetailsSheetDisplayed: true,
          };
          storageService().set("verifyDetailsSheetDisplayed", true);
      }
    }
  }
  return contactData;
}

export function handleCampaignRedirection (url, showRedirectUrl) {
  const config = getConfig()
  let campLink = url;
  let plutusRedirectUrl = `${getBasePath()}/?is_secure=${config.isSdk}&partner_code=${config.code}`;
  // Adding redirect url for testing
  // eslint-disable-next-line
  campLink = `${campLink}${campLink.match(/[\?]/g) ? "&" : "?"}generic_callback=true&${showRedirectUrl ? "redirect_url" : "plutus_redirect_url"}=${encodeURIComponent(plutusRedirectUrl)}&campaign_version=1`
  window.location.href = campLink;
}

export function dateValidation(endDate, startDate) {
  const date = new Date();
  const currentDate = (date.getMonth() + 1) + "/" + date.getDate() + "/"  +date.getFullYear();
  if(!endDate && !startDate) return true;
  const startDateInMs = Date.parse(startDate);
  const endDateInMs = Date.parse(endDate);
  const currentDateInMs = Date.parse(currentDate);
  if(startDate && endDate && (startDateInMs <= endDateInMs) && (startDateInMs <= currentDateInMs) && (currentDateInMs <= endDateInMs)) {
    return true;
  } 
  if(startDate && !endDate && (startDateInMs <= currentDateInMs)) {
    return true;
  } 
  if(!startDate && endDate && (currentDateInMs <= endDateInMs)) {
    return true;
  }
  return false;
}

export const handleCampaign = ({ campaignData, handleLoader, handleDialogStates }) => () => {
  const campLink = campaignData.url;
  if(campaignData.campaign_name === "insurance_o2o_campaign"){
    hitFeedbackURL(campaignData.action_buttons?.buttons[0]?.feedback_url)
    return;
  }
  handleDialogStates({ openCampaignDialog : false })
  handleLoader({ pageLoader : 'page' });
  const showRedirectUrl = campaignData.campaign_name === "whatsapp_consent";
  handleCampaignRedirection(campLink, showRedirectUrl);
}

export async function hitFeedbackURL(url) {
  try {
    const res = await Api.get(url);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

export const closeCampaignDialog = ({ campaignData, handleDialogStates }) => () => {
  const campaignsToHitFeedback = ["insurance_o2o_campaign", "trading_restriction_campaign"];
  if(campaignsToHitFeedback.includes(campaignData.campaign_name)){
    hitFeedbackURL(campaignData.action_buttons?.buttons[0]?.feedback_url)
  }
  handleDialogStates({ openCampaignDialog: false })
}

export async function updateConsent() {
  const res = await Api.post("/api/account/user/partnerconsent");
  if(!res || res?.pfwstatus_code !== 200 || isEmpty(res?.pfwresponse)) {
    throw new Error(res.pfwmessage || errorMessage)
  }
  const { result, status_code: status } = res.pfwresponse;
  if (status === 200) {
    return result;
  }
  throw new Error(result.message || result.error || errorMessage);
}

export async function updateBank(data) {
  const response = await Api.post("/api/partner/user/updatebank", data);
  if (
    response.pfwstatus_code !== 200 ||
    isEmpty(response.pfwresponse)
  ) {
    throw new Error( response?.pfwmessage || errorMessage);
  }
  const { status_code, result } = response.pfwresponse;
  if (status_code === 200) {
    return result;
  } else {
    throw new Error(result?.message || result?.error || errorMessage);
  }
}

export function openBfdlBanner(handleDialogStates) {
  const config = getConfig();
  const isBfdlBannerDisplayed = storageService().getBoolean("bfdlBannerDisplayed");
  if(!isBfdlBannerDisplayed && config.code === 'bfdlmobile' && (config.isIframe || config.isSdk)) {
    storageService().setBoolean("bfdlBannerDisplayed", true);
    handleDialogStates({ openBfdlBanner: true });
  }
}
