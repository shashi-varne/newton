import Api from "utils/api";
import { storageService, isEmpty, splitMobileNumberFromContryCode } from "utils/validators";
import toast from "../../common/ui/Toast";
import { getConfig, navigate as navigateFunc, getBasePath, isTradingEnabled, getInvestCards } from "utils/functions";
import {
  apiConstants,
  investCardsBase,
  keyPathMapper,
  kycStatusMapper,
  kycStatusMapperInvest,
  premiumBottomSheetMapper,
  sdkInvestCardMapper
} from "./constants";
import { getKycAppStatus, isReadyToInvest, setKycProductType, setSummaryData } from "../../kyc/services";
import { get_recommended_funds } from "./common/api";
import { PATHNAME_MAPPER } from "../../kyc/constants";
import { isEquityCompleted } from "../../kyc/common/functions";
import { nativeCallback, openModule } from "../../utils/native_callback";

let errorMessage = "Something went wrong!";
export async function initialize() {
  const config = getConfig();
  this.getSummary = getSummary.bind(this);
  this.setSummaryData = setSummaryData.bind(this);
  this.setInvestCardsData = setInvestCardsData.bind(this);
  this.handleRenderCard = handleRenderCard.bind(this);
  this.getRecommendationApi = getRecommendationApi.bind(this);
  this.getRecommendations = getRecommendations.bind(this);
  this.getRateOfInterest = getRateOfInterest.bind(this);
  this.corpusValue = corpusValue.bind(this);
  this.navigate = navigateFunc.bind(this.props);
  this.clickCard = clickCard.bind(this);
  this.initilizeKyc = initilizeKyc.bind(this);
  this.openKyc = openKyc.bind(this);
  this.setProductType = setProductType.bind(this);
  this.openPremiumOnboardBottomSheet = openPremiumOnboardBottomSheet.bind(this);
  this.handleKycSubmittedOrRejectedState = handleKycSubmittedOrRejectedState.bind(this);
  this.handleCampaign = handleCampaign.bind(this);
  this.closeCampaignDialog = closeCampaignDialog.bind(this);
  this.handleStocksAndIpoCards = handleStocksAndIpoCards.bind(this);
  this.setKycProductTypeAndRedirect = setKycProductTypeAndRedirect.bind(this);
  this.handleIpoCardRedirection = handleIpoCardRedirection.bind(this);
  this.handleCommonKycRedirections = handleCommonKycRedirections.bind(this);
  this.contactVerification = contactVerification.bind(this);
  let dataSettedInsideBoot = storageService().get("dataSettedInsideBoot");
  if (config) {
    this.setState({ config });
  }
  if ((this.state.screenName === "invest_landing" || this.state.screenName === "sdk_landing" ) && dataSettedInsideBoot) {
    storageService().set("dataSettedInsideBoot", false);
  }
  if(this.state.screenName === "invest_landing"){
    this.setInvestCardsData();
  } else if(this.state.screenName === "sdk_landing") {
    this.handleRenderCard();
  }

  if ((this.state.screenName === "invest_landing" &&  config.Web &&
      !dataSettedInsideBoot)) {
    await this.getSummary();
  }
  if (this.state.screenName === "sdk_landing" && !config.Web) {
    await this.getSummary();
  }
  if (this.onload) this.onload();
  if(this.props?.location?.state?.fromState === "/kyc/registration/success") {
    const _event = {
      event_name: "journey_details",
      properties: {
        journey: {
          name: "kyc",
          trigger: "cta",
          journey_status: "complete",
          next_journey: "reports"
        }
      }
    };

    // send event
    if (!config.Web) {
      window.callbackWeb.eventCallback(_event);
    } else if (config.isIframe) {
      window.callbackWeb.sendEvent(_event);
    }
  }
}

export async function getSummary() {
  let userKyc = storageService().getObject("kyc") || {};
  let currentUser = storageService().getObject("user") || {};
  if(isEmpty(currentUser) || isEmpty(userKyc)) {
    this.setState({ show_loader: true,  kycStatusLoader : true });
  } else {
    this.setState({ show_loader: false,  kycStatusLoader : true });
  }
  try {
    const res = await Api.post(apiConstants.accountSummary, {
      campaign: ["user_campaign"],
      kyc: ["kyc"],
      user: ["user"],
      nps: ["nps_user"],
      partner: ["partner"],
      bank_list: ["bank_list"],
      referral: ["subbroker", "p2p"],
      contacts: ["contacts"]
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setSummaryData(result);
      currentUser = result.data.user.user.data;
      userKyc = result.data.kyc.kyc.data;
      this.setState({ show_loader: false, kycStatusLoader : false, userKyc, currentUser });
    } else {
      this.setState({ show_loader: false, kycStatusLoader : false });
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export function setInvestCardsData() {
  const { config = getConfig() } = this.state;
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
    nps: ["cccb", "sury", "obc", "svcho", "ktb", "sbm", "cub"],
    gold: ["apna", "cccb", "sury", "obc", "svcho", "alb", "ktb", "cub"],
  };

  const referralData = storageService().getObject("referral") || {};
  let subbrokerCode = "";
  if (referralData?.subbroker?.data) {
    subbrokerCode = referralData.subbroker.data.subbroker_code;
  }

  if (config.code === "bfdlmobile") {
    investCardsBase["ourRecommendations"]["instaredeem"].title = "Money +";
  }

  let investCardsData = {}; // stores card data to display
  const { investSections, investSubSectionMap } = config;

  for (let section of investSections) {
    const subSections = investSubSectionMap[section] || [];
    if (subSections.length > 0) {
      investCardsData[section] = [];
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
        investCardsData[section].push(cardData);
      }
    }
    this.setState({ investCardsData, investSections });
  }
}

export function clickCard(state, title) {
  if (state !== "passiveIndexFunds") this.sendEvents("next", title);
  switch (state) {
    case "100_sip":
      this.getRecommendationApi(100);
      break;
    case "300_sip":
      this.getRecommendationApi(300);
      break;
    case "kyc":
      this.openKyc();
      break;
    case "stocks":
    case "ipo":
      this.handleStocksAndIpoCards(state)
      break;
    case "insurance":
      let insurancePath = "/group-insurance";
      this.navigate(insurancePath);
      break;
    case "gold":
      let goldPath = "/gold/my-gold";
      this.navigate(goldPath)
      break;
    case "fhc":
      let fhcPath = "/fhc";
      this.navigate(fhcPath)
      break;
    case "risk_profile":
      let riskProfilePath = "/risk/result-new";
      this.navigate(riskProfilePath, {
        state: { fromExternalSrc: true }
      });
      break;
    case "top_equity":
      this.navigate(`/diy/fundlist/Equity/Multi_Cap`);
      break;
    default:
      this.navigate(keyPathMapper[state] || state);
      break;
  }
}

export async function getRecommendationApi(amount) {
  const params = {
    investType: "buildwealth",
    term: 5,
    amount: amount,
  };

  this.setState({
    show_loader: true,
    investType: params.investType,
    term: params.term,
  });

  try {
    const { recommendation } = await get_recommended_funds(params);
    
    this.setState({
      equity: recommendation.equity,
      debt: recommendation.debt
    });

    const funnelData = {
      recommendation: recommendation,
      amount: params.amount,
      term: params.term,
      // eslint-disable-next-line
      year: parseInt(new Date().getFullYear() + params.term),
      corpus: this.corpusValue(params),
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
    storageService().setObject("funnelReturnRates", {
      stockReturns: recommendation.expected_return_eq,
      bondReturns: recommendation.expected_return_debt
    });

    if (amount === 300) {
      this.navigate(`/invest/buildwealth/amount`);
    } else {
      this.getRecommendations(amount);
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

function getRateOfInterest(data) {
  let range = Math.abs(data.stockReturns - data.bondReturns);
  if (data.equity < 1) {
    return data.bondReturns;
  } else if (data.equity > 99) {
    return data.stockReturns;
  } else {
    let rateOffset = (range * data.equity) / 100;
    return data.bondReturns + rateOffset;
  }
}

export function corpusValue(data) {
  let principle = data.amount;
  let corpus_value = 0;
  for (var i = 0; i < data.term; i++) {
    if (this.state.isRecurring || data.investType === "buildwealth") {
      let n = (i + 1) * 12;
      let mr = getRateOfInterest(data) / 12 / 100;
      corpus_value = (data.amount * (Math.pow(1 + mr, n) - 1)) / mr;
    } else {
      var currInterest = (principle * getRateOfInterest()) / 100;
      corpus_value = principle + currInterest;
      principle += currInterest;
    }
  }
  return corpus_value;
}

export async function getRecommendations(amount) {
  const { config = getConfig() } = this.state;
  try {
    const result = await get_recommended_funds({
      type: this.state.investType,
      amount: amount,
      term: this.state.term,
      equity: this.state.equity,
      debt: this.state.debt,
      rp_enabled: config.riskEnabledFunnels
    });

    if (!result.recommendation) {
      // RP enabled flow, when user has no risk profile
      storageService().remove('userSelectedRisk');
      if (result.msg_code === 0) {
        this.navigate(`/invest/${this.state.investType}/risk-select`);
      } else if (result.msg_code === 1) {
        this.navigate(`/invest/${this.state.investType}/risk-select-skippable`);
      }
      return;
    }

    const funnelData = {
      term: this.state.term,
      investType: this.state.investType,
      name: this.state.investName,
      graphType: this.state.investType,
      investTypeDisplay: this.state.investTypeDisplay,
      showRecommendationTopCards: true,
      ...result
    };
    storageService().setObject("funnelData", funnelData);
    storageService().set("userSelectedRisk", result.rp_indicator);

    this.navigate("/invest/recommendations");
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
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

export function initilizeKyc() {
  const { config = getConfig() } = this.state;
  let userKyc = this.state.userKyc || storageService().getObject("kyc") || {};
  const TRADING_ENABLED = isTradingEnabled(userKyc);
  let currentUser =
    this.state.currentUser || storageService().getObject("user") || {};
  let isCompliant = userKyc.kyc_status === "compliant" ? true : false;
  let getKycAppStatusData = getKycAppStatus(userKyc);
  let kycJourneyStatus = getKycAppStatusData.status;
  let kycStatusData = kycStatusMapperInvest[kycJourneyStatus];
  const rejectedItems = getKycAppStatusData.rejectedItems;
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
  let isReadyToInvestBase = isReadyToInvest();
  let isEquityCompletedBase = isEquityCompleted();
  let kycJourneyStatusMapperData = kycJourneyStatus.includes("ground_") ? kycStatusMapper["incomplete"] : kycStatusMapper[kycJourneyStatus];

  this.setState({
    isCompliant,
    kycStatusData,
    kycJourneyStatusMapperData,
    userKyc,
    currentUser,
    kycJourneyStatus,
    isReadyToInvestBase,
    isEquityCompletedBase,
    getKycAppStatusData,
    rejectedItems,
    tradingEnabled: TRADING_ENABLED,
  });
  let bottom_sheet_dialog_data_premium = {};
  let premium_onb_status = "";
  if (isCompliant && !TRADING_ENABLED) {
    premium_onb_status = kycJourneyStatus;
    if (
      ["ground_premium", "init", "incomplete"].indexOf(kycJourneyStatus) !== -1
    ) {
      bottom_sheet_dialog_data_premium =
        premiumBottomSheetMapper[premium_onb_status];
      bottom_sheet_dialog_data_premium.status = premium_onb_status;
    }

    if (
      ["submitted", "complete"].indexOf(kycJourneyStatus) !== -1 &&
      !currentUser.active_investment &&
      userKyc.bank.meta_data_status === "approved"
    ) {
      bottom_sheet_dialog_data_premium = kycStatusMapper["mf_complete"];
      bottom_sheet_dialog_data_premium.status = premium_onb_status;
    }

    // Todo: Remove it later, as this sets bottomsheets data and shows on first app landing which will now be shown on card click
    // if (["rejected"].indexOf(kycJourneyStatus) !== -1) {
    //   bottom_sheet_dialog_data_premium = kycStatusMapper[premium_onb_status];
    //   bottom_sheet_dialog_data_premium.status = premium_onb_status;
    // }

    this.setState({ bottom_sheet_dialog_data_premium });
    if (premium_onb_status && !isEmpty(bottom_sheet_dialog_data_premium)) {
      let banklist = storageService().getObject("banklist");
      if ((banklist && banklist.length) || config.code === "moneycontrol") {
        return;
      } else {
        this.openPremiumOnboardBottomSheet(
          bottom_sheet_dialog_data_premium,
          userKyc,
          TRADING_ENABLED
        );
      }
    }
  }

  let modalData = {}
  const kycStatusesToShowDialog = ["verifying_trading_account", "complete", "fno_rejected", "esign_pending"];
  let isLandingBottomSheetDisplayed = storageService().get("landingBottomSheetDisplayed");
  if (kycStatusesToShowDialog.includes(kycJourneyStatus)) {
    if (isLandingBottomSheetDisplayed) {
      return;
    }

    if (["fno_rejected", "complete"].includes(kycJourneyStatus)) {
      if (TRADING_ENABLED && userKyc.equity_investment_ready) {
        modalData = kycStatusMapper["kyc_verified"];
        if (kycJourneyStatus === "fno_rejected") {
          modalData.subtitle = "You can start your investment journey by investing in your favourite stocks, mutual funds."
        }
      } else if (!TRADING_ENABLED && !isCompliant) {
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

    if(!modalData.dualButton)
      modalData.oneButton = true;
    this.setState({ modalData, openKycStatusDialog: true });
  }
  this.contactVerification(userKyc);
}

export function openPremiumOnboardBottomSheet(
  bottom_sheet_dialog_data_premium,
  userKyc,
  TRADING_ENABLED
) {
  const { config = getConfig() } = this.state;
  let is_bottom_sheet_displayed_kyc_premium = storageService().get(
    "is_bottom_sheet_displayed_kyc_premium"
  );

  if (is_bottom_sheet_displayed_kyc_premium) {
    return "";
  }

  if (config.Web && this.state.screenName !== "invest_landing") {
    return;
  }

  if (!config.Web && this.state.screenName !== "landing") {
    return;
  }

  storageService().set("is_bottom_sheet_displayed_kyc_premium", true);
  
  this.setState({
    modalData: bottom_sheet_dialog_data_premium,
    openKycPremiumLanding: true,
  });
}

export function handleKycSubmittedOrRejectedState() {
  let { kycJourneyStatusMapperData } = this.state;
  
  let modalData = Object.assign({}, kycJourneyStatusMapperData);
  if(!modalData.dualButton) {
    modalData.oneButton = true;
  }
  this.setState({ modalData, openKycStatusDialog: true });
}

export async function openKyc() {
  let { kycJourneyStatus } = this.state;

  storageService().set("kycStartPoint", "mf");
  const kycStatusesToShowDialog = ["submitted", "rejected", "fno_rejected", "esign_pending", "verifying_trading_account"];
  if (kycStatusesToShowDialog.includes(kycJourneyStatus)) {
    this.handleKycSubmittedOrRejectedState();
  } else {
    this.handleCommonKycRedirections();
  }
}

export async function handleCommonKycRedirections() {
  let { userKyc, kycJourneyStatus, tradingEnabled, kycStatusData } = this.state;
  if (kycJourneyStatus === "ground") {
    this.navigate("/kyc/home");
  } else if (kycJourneyStatus === "ground_pan") {
    this.navigate("/kyc/journey", {
      state: {
        show_aadhaar: !(userKyc.address.meta_data.is_nri || userKyc.kyc_type === "manual") ? true : false,
      },
    });
  } else if ((tradingEnabled && userKyc?.kyc_product_type !== "equity")) {
    await this.setKycProductTypeAndRedirect();
  } else if (kycStatusData.nextState) {
    this.navigate(kycStatusData.nextState);
  }
}

export async function setKycProductTypeAndRedirect() {
  let { userKyc, isReadyToInvestBase, kycJourneyStatus, config = getConfig() } = this.state;
  let result;
  if (!userKyc?.mf_kyc_processed) {
    let showLoader = true;
    this.setState({ show_loader: showLoader })
    result = await this.setProductType();
    this.setState({ userKyc: result?.kyc });
  }
  
  // already kyc done users
  if (isReadyToInvestBase && (result?.kyc?.mf_kyc_processed || userKyc?.mf_kyc_processed)) {
    this.navigate(PATHNAME_MAPPER.tradingInfo)
  } else if (kycJourneyStatus === "ground") {
    this.navigate("/kyc/home");
  } else {
    const showAadhaar = !(result?.kyc?.address.meta_data.is_nri || result?.kyc?.kyc_type === "manual");
    if (result?.kyc?.kyc_status !== "compliant") {
      this.navigate(PATHNAME_MAPPER.journey, {
        searchParams: `${config.searchParams}&show_aadhaar=${showAadhaar}`
      });
    } else {
      this.navigate(PATHNAME_MAPPER.journey)
    }
  }
}

export function handleIpoCardRedirection() {
  const { userKyc, config = getConfig() } = this.state;
  if (
      userKyc.equity_investment_ready &&
      this.state.currentUser?.pin_status !== 'pin_setup_complete'
  ) {
    openModule('account/setup_2fa', this.props, { routeUrlParams: '/ipo' });
    if (config.isNative) {
      return nativeCallback({ action: 'exit_web' });
      // TODO: Test native behaviour for this code
    }
  } else {
    this.navigate("/market-products");
  }
}
          
export function handleStocksAndIpoCards(key) {
  let { kycJourneyStatusMapperData, kycJourneyStatus, userKyc, currentUser } = this.state;
  let modalData = Object.assign({key}, kycJourneyStatusMapperData);

  if (key === "ipo") {
    if (kycJourneyStatus === "verifying_trading_account") {
      modalData = {
        ...modalData,
        subtitle: "This process could take upto 48 hours. We will notify you once it’s done. Meanwhile, you can explore primary market products",
        buttonTitle: "CONTINUE",
        handleClick: this.handleIpoCardRedirection
      }
    } else if (kycJourneyStatus === "submitted") {
      modalData = {
        ...modalData,
        buttonTitle: "CONTINUE",
        handleClick: this.handleIpoCardRedirection
      }
    } else if (
      userKyc.equity_investment_ready ||
      (kycJourneyStatus === "complete" && userKyc.kyc_product_type === 'equity') ||
      kycJourneyStatus === "fno_rejected"
    ) {
      this.handleIpoCardRedirection();
      return
    }
  } else if (key === "stocks") {
    if (
      userKyc.equity_investment_ready ||
      (kycJourneyStatus === "complete" && userKyc.kyc_product_type === 'equity')
    ) {
      if (currentUser?.pin_status !== 'pin_setup_complete') {
        openModule('account/setup_2fa', this.props, { routeUrlParams: '/stocks' });
        const { config = getConfig() } = this.state;
        if (config.isNative) {
          return nativeCallback({ action: 'exit_web' });
          // TODO: Test native behaviour for this code
        }
      } else {
        console.log("redirection"); // Todo: Remove this console once you enter redirection path to stocks sdk
        // Todo: Redirect to stocks sdk
      }
    }
  }
  if(key === "stocks" && !modalData.dualButton) {
    modalData.oneButton = true
  }

  if (!isEmpty(modalData) && (kycJourneyStatus !== "complete" || (kycJourneyStatus === "complete" && userKyc.kyc_product_type !== "equity"))) {
    this.setState({ modalData, openKycStatusDialog: true });
  }
}

async function setProductType() {
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
    let showLoader = false;
    this.setState({ show_loader: showLoader, stocksButtonLoader: showLoader})
  }
}

export const resetRiskProfileJourney = () => {
  storageService().set("came_from_risk_webview", "");
  storageService().set("firsttime_from_risk_webview_invest", "");
  return;
};

function handleInvestSubtitle ()  {
  const investCards = getInvestCards(["nps", "gold"]);
  let investCardSubtitle = 'Mutual funds';
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
  let isReadyToInvestBase = isReadyToInvest();
  const { config = getConfig() } = this.state;
  const isWeb = config.Web;
  const hideReferral = currentUser.active_investment && !isWeb && config?.referralConfig?.shareRefferal;
  const referralCode = !currentUser.active_investment && !isWeb && config?.referralConfig?.applyRefferal;
  const myAccount = isReadyToInvestBase || userKyc.bank.doc_status === 'rejected';
  const kyc = !isReadyToInvestBase;
  const cards = sdkInvestCardMapper.filter(el => {
    if(el.key === 'kyc') {
      return kyc;
    } else if(el.key === 'account') {
      return myAccount;
    } else if(el.key === 'refer') {
      if(referralCode){
        el.referralCode = true;
        el.path = "";
        return referralCode;
      } else {
        return hideReferral;
      }
    } else {
      if(el.key === 'invest') {
        el.subtitle = handleInvestSubtitle()
      }
      return true;
    }
  })
  this.setState({renderLandingCards : cards});
}

export function handleCampaignNotification () {
  const notifications = storageService().getObject('campaign') || [];
  const bottom_sheet_dialog_data = notifications.reduceRight((acc, data) => {
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

  if (!isEmpty(bottom_sheet_dialog_data)) {
    storageService().set('is_bottom_sheet_displayed', true);
    this.setState({ bottom_sheet_dialog_data, openBottomSheet: true });
  }
};

export function contactVerification(userKyc) {
  const contactDetails = userKyc?.identification?.meta_data;
  // ---------------- IPO Contact Verification Setting state for BottomSheet---------------//
  if (!isEmpty(contactDetails)) {
    if (contactDetails.mobile_number_verified === false) {
      const contactValue = splitMobileNumberFromContryCode(contactDetails?.mobile_number)
      this.setState({
        communicationType: "mobile",
        contactValue,
        contactNotVerified: true,
      })
    } else if (contactDetails.email_verified === false) {
      this.setState({
        communicationType: "email",
        contactValue: contactDetails?.email || "",
        contactNotVerified: true,
      })
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
          this.setState({
            openKycPremiumLanding: false, // This(openKycPremiumLanding, openBottomSheet, openKycStatusDialog for campign) 3 are Onload bottomSheet
            openBottomSheet: false, //Which Are Disable As contactVerification Takes highest priority.
            openKycStatusDialog: false,
            verifyDetails: true,
            verifyDetailsData: {
              contact_type,
              contact_value
            },
            verifyDetailsType: contact_type
          })
          storageService().set("verifyDetailsSheetDisplayed", true);
        }
      }
  }
}

export function handleCampaignRedirection (url, showRedirectUrl) {
  const { config = getConfig() } = this.state;
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

export function handleCampaign() {
  const { bottom_sheet_dialog_data = {} } = this.state
  const campLink = bottom_sheet_dialog_data.url;
  if(bottom_sheet_dialog_data.campaign_name === "insurance_o2o_campaign"){
    hitFeedbackURL(bottom_sheet_dialog_data.action_buttons?.buttons[0]?.feedback_url)
    return;
  }
  this.setState({showPageLoader : 'page', openBottomSheet : false});
  const showRedirectUrl = bottom_sheet_dialog_data.campaign_name === "whatsapp_consent";
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

export function closeCampaignDialog() {
  const { bottom_sheet_dialog_data = {} } = this.state
  if(bottom_sheet_dialog_data.campaign_name === "insurance_o2o_campaign"){
    hitFeedbackURL(bottom_sheet_dialog_data.action_buttons?.buttons[0]?.feedback_url)
  }
  this.setState({ openBottomSheet: false })
}