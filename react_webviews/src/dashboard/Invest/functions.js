import Api from "utils/api";
import { storageService, splitMobileNumberFromContryCode } from "../../utils/validators";
import toast from "../../common/ui/Toast";
import { getConfig, navigate as navigateFunc, getBasePath, isTradingEnabled, getInvestCards } from "../../utils/functions";
import {
  investCardsBase,
  kycStatusMapper,
  kycStatusMapperInvest,
  premiumBottomSheetMapper,
  sdkInvestCardMapper
} from "./constants";
import { getAccountSummary, getKycAppStatus, isReadyToInvest, setKycProductType, setSummaryData } from "../../kyc/services";
import { get_recommended_funds } from "./common/api";
import { PATHNAME_MAPPER } from "../../kyc/constants";
import { isEquityCompleted } from "../../kyc/common/functions";
import { nativeCallback, openModule } from "../../utils/native_callback";
import { isEmpty, isFunction } from "lodash";
import { getCorpusValue } from "./common/commonFunctions";

let errorMessage = "Something went wrong!";
export async function initialize({screenName, handleLoader, handleSummaryData}) {
  const config = getConfig();
  // this.getSummary = getSummary.bind(this);
  // this.setSummaryData = setSummaryData.bind(this);
  // this.setInvestCardsData = setInvestCardsData.bind(this);
  // this.handleRenderCard = handleRenderCard.bind(this);
  // this.getRecommendationApi = getRecommendationApi.bind(this);
  // this.getRecommendations = getRecommendations.bind(this);
  // this.navigate = navigateFunc.bind(this.props);
  // this.clickCard = clickCard.bind(this);
  // this.initilizeKyc = initilizeKyc.bind(this);
  // this.openKyc = openKyc.bind(this);
  // this.setProductType = setProductType.bind(this);
  // this.openPremiumOnboardBottomSheet = openPremiumOnboardBottomSheet.bind(this);
  // this.handleKycSubmittedOrRejectedState = handleKycSubmittedOrRejectedState.bind(this);
  // this.handleCampaign = handleCampaign.bind(this);
  // this.closeCampaignDialog = closeCampaignDialog.bind(this);
  // this.handleStocksAndIpoCards = handleStocksAndIpoCards.bind(this);
  // this.initiatePinSetup = initiatePinSetup.bind(this);
  // this.setKycProductTypeAndRedirect = setKycProductTypeAndRedirect.bind(this);
  // this.handleIpoCardRedirection = handleIpoCardRedirection.bind(this);
  // this.contactVerification = contactVerification.bind(this);
  // this.handleCommonKycRedirections = handleCommonKycRedirections.bind(this);
  // this.contactVerification = contactVerification.bind(this);
  // this.handleCampaignNotificationData = handleCampaignNotificationData.bind(this);
  // this.openBfdlBanner = openBfdlBanner.bind(this);
  // this.closeBfdlBanner = closeBfdlBanner.bind(this);
  // this.handleStocksRedirection = handleStocksRedirection.bind(this);
  let dataSettedInsideBoot = storageService().get("dataSettedInsideBoot");
  const openEquityCallback = storageService().getBoolean("openEquityCallback");
  if (openEquityCallback) {
    storageService().setBoolean("openEquityCallback", false);
    nativeCallback({
      action: "open_equity"
    })
  }
  // if (config) {
  //   this.setState({ config });
  // }
  if ((screenName === "investLanding" || screenName === "sdk_landing" ) && dataSettedInsideBoot) {
    storageService().set("dataSettedInsideBoot", false);
  }
  // if(screenName === "investLanding"){
  //   this.setInvestCardsData();
  // } else if(screenName === "sdk_landing") {
  //   this.handleRenderCard();
  // }

  const isBfdlBannerDisplayed = storageService().getBoolean("bfdlBannerDisplayed");
  const isBfdlConfig = !isBfdlBannerDisplayed && config.code === 'bfdlmobile' && (config.isIframe || config.isSdk)
  const isWebConfig = config.Web && screenName === "investLanding";
  const isSdkConfig = config.isSdk && screenName === "sdk_landing";

  let data = {}
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
    handleLoader({kycStatusLoader: true});
  }
  try {
    const result = await getAccountSummary();
    setSummaryData(result);
    user = result.data.user.user.data;
    kyc = result.data.kyc.kyc.data;
    const subscriptionStatus = result?.data?.equity?.subscription_status?.data || {};
    handleSummaryData({ kyc, user, subscriptionStatus })
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
        cardData.key = subSection;
        cardsData[section].push(cardData);
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

export async function getRecommendations({amount, investType, term, equity, debt, investName, investTypeDisplay, navigate, handleLoader }) {
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

export function navigate(pathname, data = {}) {
  const { config = getConfig() } = this.state;
  if (this.props.edit || data.edit) {
    this.props.history.replace({
      pathname: pathname,
      search: config.searchParams,
    });
  } else {
    this.props.history.push({
      pathname: pathname,
      search: data.searchParams || config.searchParams,
      params: data.params || {},
      state: data.state || {},
    });
  }
}

export const initializeKyc = ({ user, kyc, partnerCode, screenName, handleDialogStates }) => {
  let userKyc = kyc || storageService().getObject("kyc") || {};
  const TRADING_ENABLED = isTradingEnabled(userKyc);
  let currentUser = user || storageService().getObject("user") || {};
  const isCompliant = userKyc.kyc_status === "compliant";
  const kycJourneyStatus = getKycAppStatus(userKyc)?.status || "";
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
  let kycData = {
    isCompliant,
    kycStatusData,
    kycJourneyStatusMapperData,
    userKyc,
    currentUser,
    kycJourneyStatus,
    isReadyToInvestBase,
    isEquityCompletedBase,
    tradingEnabled: TRADING_ENABLED,
    isKycCompleted,
    showKycCard,
    isKycStatusDialogDisplayed: false,
    isPremiumBottomsheetDisplayed: false,
  };
  const contactDetails = contactVerification(userKyc, handleDialogStates);
  if (contactDetails.isVerifyDetailsSheetDisplayed) {
    return { kycData, contactDetails };
  }
  let premiumDialogData = {};
  let premiumOnboardingStatus = "";
  if (isCompliant && !TRADING_ENABLED) {
    premiumOnboardingStatus = kycJourneyStatus;
    if (
      ["ground_premium", "init", "incomplete"].indexOf(kycJourneyStatus) !== -1
    ) {
      premiumDialogData = premiumBottomSheetMapper[premiumOnboardingStatus];
      premiumDialogData.status = premiumOnboardingStatus;
    }

    if (
      ["submitted", "complete"].indexOf(kycJourneyStatus) !== -1 &&
      !currentUser.active_investment &&
      userKyc.bank.meta_data_status === "approved"
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
        if (TRADING_ENABLED && userKyc.equity_investment_ready && currentUser.equity_status === "init") {
          modalData = kycStatusMapper["kyc_verified"];
        } else if (!TRADING_ENABLED && !isCompliant && !currentUser.active_investment) {
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

export function openPremiumOnboardBottomSheet({premiumDialogData, screenName, handleDialogStates}) {
  const config = getConfig()
  let isKycPremiumBottomSheetDisplayed = storageService().getBoolean(
    "isKycPremiumBottomSheetDisplayed"
  );

  if (isKycPremiumBottomSheetDisplayed || 
      (config.Web && screenName !== "investLanding") || 
      (!config.Web && screenName !== "sdk_landing")) {
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
  kycJourneyStatus,
  kycJourneyStatusMapperData,
  userKyc,
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
      userKyc,
      kycJourneyStatus,
      tradingEnabled,
      kycStatusData,
      handleLoader,
      navigate,
      updateKyc,
    });
  }
}

export async function handleCommonKycRedirections({ userKyc, kycJourneyStatus, tradingEnabled, kycStatusData, isReadyToInvestBase, navigate, handleLoader, updateKyc }) {
  if (kycJourneyStatus === "ground") {
    navigate("/kyc/home");
  } else if (kycJourneyStatus === "ground_pan") {
    navigate("/kyc/journey", {
      state: {
        show_aadhaar: !(userKyc.address.meta_data.is_nri || userKyc.kyc_type === "manual") ? true : false,
      },
    });
  } else if (!tradingEnabled && kycJourneyStatus === "complete") {
    navigate(PATHNAME_MAPPER.kycEsignNsdl, {
      searchParams: `${getConfig().searchParams}&status=success`
    });
  } else if (tradingEnabled && userKyc?.kyc_product_type !== "equity") {
    await setKycProductTypeAndRedirect({ userKyc, kycJourneyStatus, isReadyToInvestBase, handleLoader, navigate, updateKyc });
  } else if (kycStatusData.nextState) {
    navigate(kycStatusData.nextState);
  } else {
    navigate(PATHNAME_MAPPER.journey);
  }
}

export async function setKycProductTypeAndRedirect({ userKyc, kycJourneyStatus, isReadyToInvestBase, handleLoader, navigate, updateKyc }) {
  const config = getConfig();
  let result;
  if (!userKyc?.mf_kyc_processed) {
    result = await setProductType(handleLoader);
    updateKyc(result.kyc);
  }
  
  // already kyc done users
  if (isReadyToInvestBase && (result?.kyc?.mf_kyc_processed || userKyc?.mf_kyc_processed)) {
    navigate(PATHNAME_MAPPER.tradingInfo)
  } else if (kycJourneyStatus === "ground") {
    navigate("/kyc/home");
  } else {
    const showAadhaar = !(result?.kyc?.address.meta_data.is_nri || result?.kyc?.kyc_type === "manual");
    if (result?.kyc?.kyc_status !== "compliant") {
      navigate(PATHNAME_MAPPER.journey, {
        searchParams: `${config.searchParams}&show_aadhaar=${showAadhaar}`
      });
    } else {
      navigate(PATHNAME_MAPPER.journey)
    }
  }
}

export function handleIpoCardRedirection({ userKyc, currentUser, navigate, handleLoader, handleSummaryData, handleDialogStates }, props) {
  if (
      userKyc.equity_investment_ready &&
      currentUser?.pin_status !== 'pin_setup_complete'
  ) {
    initiatePinSetup({ key: "ipo", handleLoader, handleSummaryData, handleDialogStates }, props);
  } else {
    navigate("/market-products");
  }
}

function initiatePinSetup({ key, handleLoader, handleSummaryData, handleDialogStates }, props) {
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
          nativeCallback({
            action: "open_equity"
          })
        }
      },
    });
  } else {
    handleDialogStates({ openPinSetupDialog: true }, { clickedCardKey: key })
  }
}
          
export function handleStocksAndIpoCards({ key, kycJourneyStatusMapperData, kycJourneyStatus, userKyc, currentUser, handleDialogStates, handleSummaryData, navigate, handleLoader, closeKycStatusDialog }, props) {
  const config = getConfig();
  let modalData = Object.assign({key}, kycJourneyStatusMapperData);

  if (key === "ipo") {
    const handleClick = () => {
      handleIpoCardRedirection({ userKyc, currentUser, navigate, handleLoader, handleSummaryData, handleDialogStates }, props)
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
      userKyc.equity_investment_ready ||
      (kycJourneyStatus === "complete" && userKyc.kyc_product_type === 'equity') ||
      kycJourneyStatus === "fno_rejected"
    ) {
      handleIpoCardRedirection({ userKyc, currentUser, navigate, handleLoader, handleSummaryData, handleDialogStates }, props);
      return
    }
  } else if (key === "stocks") {
    if (
      userKyc.equity_investment_ready ||
      (kycJourneyStatus === "complete" && userKyc.kyc_product_type === 'equity')
    ) {
      if (currentUser?.pin_status !== 'pin_setup_complete') {
        return initiatePinSetup({ key, handleSummaryData, handleLoader }, props);
      } else if (kycJourneyStatus !== "fno_rejected") {
        if(config.isSdk) {
          nativeCallback({
            action: "open_equity"
          })
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
        nativeCallback({
          action: "open_equity"
        })
        closeKycStatusDialog()
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

  if (!isEmpty(modalData) && (kycJourneyStatus !== "complete" || (kycJourneyStatus === "complete" && userKyc.kyc_product_type !== "equity"))) {
    handleDialogStates({ openKycStatusDialog: true }, modalData)
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
  let investCardSubtitle = 'Mutual funds';

  if (isEquityEnabled) {
    investCardSubtitle = 'Stocks, F&O, IPOs, Mutual funds';
  }

  if (investCards?.gold) {
    investCardSubtitle = investCardSubtitle += ', Gold, Save tax';
  } else {
   investCardSubtitle = 'Mutual funds, Save tax';
  }

  if (investCards?.nps) {
    investCardSubtitle = investCardSubtitle += ', NPS';
  }
  return investCardSubtitle;
};

export function handleRenderCard() {
  let userKyc = this.state.userKyc || storageService().getObject("kyc") || {};
  let currentUser = this.state.currentUser || storageService().getObject("user") || {};
  const { config = getConfig() } = this.state;
  const isWeb = config.Web;
  const hideReferral = currentUser.active_investment && !isWeb && config?.referralConfig?.shareRefferal;
  const referralCode = !currentUser.active_investment && !isWeb && config?.referralConfig?.applyRefferal;
  const isEquityEnabled = isTradingEnabled(userKyc);
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
  this.setState({renderLandingCards : cards});
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

export function contactVerification(userKyc, handleDialogStates) {
  let contactData = {}
  const contactDetails = userKyc?.identification?.meta_data;
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
  if (!isVerifyDetailsSheetDisplayed) {
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

// sets every other dialog to false, except the one passed as key to be displayed
export function setDialogsState(key) {
  this.setState({
    openKycPremiumLanding: false,
    openCampaignDialog: false,
    openKycStatusDialog: false,
    verifyDetails: false,
    [key]: true
  });
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

export function closeBfdlBanner() {
  this.setState({ openBfdlBanner: false });
}
