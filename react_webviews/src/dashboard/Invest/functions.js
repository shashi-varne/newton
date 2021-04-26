import Api from "utils/api";
import { storageService, isEmpty } from "utils/validators";
import toast from "../../common/ui/Toast";
import { getConfig } from "utils/functions";
import {
  apiConstants,
  investCardsBase,
  keyPathMapper,
  kycStatusMapper,
  kycStatusMapperInvest,
  premiumBottomSheetMapper,
  sdkInvestCardMapper
} from "./constants";
import { getKycAppStatus, isReadyToInvest } from "../../kyc/services";

let errorMessage = "Something went wrong!";
export async function initialize() {
  this.getSummary = getSummary.bind(this);
  this.setSummaryData = setSummaryData.bind(this);
  this.setInvestCardsData = setInvestCardsData.bind(this);
  this.handleRenderCard = handleRenderCard.bind(this);
  this.getRecommendationApi = getRecommendationApi.bind(this);
  this.getRecommendedPlans = getRecommendedPlans.bind(this);
  this.getRateOfInterest = getRateOfInterest.bind(this);
  this.corpusValue = corpusValue.bind(this);
  this.navigate = navigate.bind(this);
  this.clickCard = clickCard.bind(this);
  this.initilizeKyc = initilizeKyc.bind(this);
  this.openKyc = openKyc.bind(this);
  this.openPremiumOnboardBottomSheet = openPremiumOnboardBottomSheet.bind(this);
  let dataSettedInsideBoot = storageService().get("dataSettedInsideBoot");
  if ( (this.state.screenName === "invest_landing" || this.state.screenName === "sdk_landing" ) && dataSettedInsideBoot) {
    storageService().set("dataSettedInsideBoot", false);
  }
  if(this.state.screenName === "invest_landing"){
    this.setInvestCardsData();
  } else if(this.state.screenName === "sdk_landing") {
    this.handleRenderCard();
  }

  if ((this.state.screenName === "invest_landing" &&  getConfig().Web &&
      !dataSettedInsideBoot)) {
    await this.getSummary();
  }
  if ((this.state.screenName === "sdk_landing" && !getConfig().Web &&
      !dataSettedInsideBoot)) {
    await this.getSummary();
  }
  if (this.onload) this.onload();
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
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      this.setSummaryData(result);
      this.setState({ show_loader: false, kycStatusLoader : false });
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

export function setSummaryData(result) {
  let currentUser = result.data.user.user.data;
  let userKyc = result.data.kyc.kyc.data;
  this.setState({
    currentUser: currentUser,
    userKyc: userKyc,
  });
  if (result.data.kyc.kyc.data.firstlogin) {
    storageService().set("firstlogin", true);
  }
  storageService().set("currentUser", true);
  storageService().setObject("user", result.data.user.user.data);
  storageService().setObject("kyc", result.data.kyc.kyc.data);

  let campaignData = getCampaignBySection(
    result.data.campaign.user_campaign.data
  );
  storageService().setObject("campaign", campaignData);
  storageService().setObject("npsUser", result.data.nps.nps_user.data);
  storageService().setObject("banklist", result.data.bank_list.bank_list.data);
  storageService().setObject("referral", result.data.referral);
  let partner = "";
  let consent_required = false;
  if (result.data.partner.partner.data) {
    partner = result.data.partner.partner.data.name;
    consent_required = result.data.partner.partner.data.consent_required;
  }
  storageService().set("consent_required", consent_required);
  if (partner === "bfdl") {
    storageService().set("partner", "bfdlmobile");
  } else if (partner === "obcweb") {
    storageService().set("partner", "obc");
  } else if (
    result.data.referral.subbroker.data.subbroker_code === "hbl" ||
    result.data.referral.subbroker.data.subbroker_code === "sbm" ||
    result.data.referral.subbroker.data.subbroker_code === "flexi" ||
    result.data.referral.subbroker.data.subbroker_code === "medlife" ||
    result.data.referral.subbroker.data.subbroker_code === "life99"
  ) {
    storageService().set(
      "partner",
      result.data.referral.subbroker.data.subbroker_code
    );
  } else {
    storageService().set("partner", partner);
  }
  setNpsData(result);
}

export function getCampaignBySection(notifications, sections) {
  if (!sections) {
    sections = [];
  }

  if (!notifications) {
    notifications = storageService().getObject("campaign") || [];
  }

  let notificationsData = [];

  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].campaign.name === "PlutusPendingTransactionCampaign") {
      continue;
    }

    notificationsData.push(notifications[i]);
  }

  return notificationsData;
}

export async function setNpsData(response) {
  if (
    response.data.user.user.data.nps_investment &&
    response.data.nps.nps_user.data.is_doc_required
  ) {
    try {
      const res = await Api.get(apiConstants.npsInvestStatus);
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        if (!result.registration_details.additional_details_status) {
          storageService().set("nps_additional_details_required", true);
        } else {
          storageService().set("nps_additional_details_required", false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    storageService().set("nps_additional_details_required", false);
  }
}

export function setInvestCardsData() {
  const disabledPartnersMap = {
    insurance: [
      "lvb",
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
    gold: ["apna", "lvb", "cccb", "sury", "obc", "svcho", "alb", "ktb", "cub"],
  };

  const referralData = storageService().getObject("referral") || {};
  let subbrokerCode = "";
  if (referralData?.subbroker?.data) {
    subbrokerCode = referralData.subbroker.data.subbroker_code;
  }

  if (getConfig().code === "bfdlmobile") {
    investCardsBase["ourRecommendations"]["instaredeem"].title = "Money +";
  }

  let investCardsData = {}; // stores card data to display
  const { investSections, investSubSectionMap } = getConfig();

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
  //  this.sendCleverTapEvents("next", title);
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
      let riskProfilePath = "/risk/result";
      this.navigate(riskProfilePath)
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
  let data = {
    investType: "buildwealth",
    term: 15,
    stockReturns: 15,
    bondReturns: 8,
    amount: amount,
  };
  this.setState({
    show_loader: true,
    investType: data.investType,
    term: data.term,
    stockReturns: data.stockReturns,
    bondReturns: data.bondReturns,
  });
  try {
    const res = await Api.get(apiConstants.getRecommendation, {
      type: data.investType,
      amount: data.amount,
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      data.equity = result.recommendation.equity;
      data.debt = result.recommendation.debt;
      this.setState({ equity: data.equity, debt: data.debt });
      let date = new Date();
      let funnelData = {
        recommendation: result.recommendation,
        amount: data.amount,
        term: data.term,
        // eslint-disable-next-line
        year: parseInt(date.getFullYear() + data.term),
        corpus: this.corpusValue(data),
        investType: data.investType,
        investTypeDisplay: "sip",
        name: "Wealth building",
        isSliderEditable: result.recommendation.editable,
        equity: result.recommendation.equity,
        debt: result.recommendation.debt,
        graphType: data.investType,
      };
      storageService().setObject("funnelData", funnelData);
      if (amount === 300) {
        this.navigate(`/invest/buildwealth/amount`);
        this.setState({ show_loader: false });
      } else {
        this.getRecommendedPlans(amount);
      }
    } else {
      this.setState({ show_loader: false });
      toast(result.message || result.error || errorMessage);
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

export async function getRecommendedPlans(amount) {
  try {
    const res = await Api.get(apiConstants.getRecommendation, {
      type: this.state.investType,
      amount: amount,
      term: this.state.term,
      subType: this.state.subType,
      equity: this.state.equity,
      debt: this.state.debt,
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      let funnelData = {
        recommendation: result.recommendation,
        alternatives: result.alternatives,
        amount: result.amount,
        term: this.state.term,
        investType: this.state.investType,
        name: this.state.investName,
        subType: this.state.subType,
        graphType: this.state.investType,
        investTypeDisplay: this.state.investTypeDisplay,
        stock: this.state.equity,
        bond: this.state.debt,
      };
      storageService().setObject("funnelData", funnelData);
      this.navigate("/invest/recommendations");
      this.setState({ show_loader: false });
    } else {
      this.setState({ show_loader: false });
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export function navigate(pathname, data = {}) {
  if (this.props.edit || data.edit) {
    this.props.history.replace({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  } else {
    this.props.history.push({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
      params: data.params || {},
      state: data.state || {},
    });
  }
}

export function initilizeKyc() {
  let userKyc = this.state.userKyc || storageService().getObject("kyc") || {};
  let currentUser =
    this.state.currentUser || storageService().getObject("user") || {};
  let isCompliant = userKyc.kyc_status === "compliant" ? true : false;
  let getKycAppStatusData = getKycAppStatus(userKyc);
  let kycJourneyStatus = getKycAppStatusData.status;
  let kycStatusData = kycStatusMapperInvest[kycJourneyStatus];
  if (isCompliant) {
    if (["init", "incomplete"].indexOf(kycJourneyStatus) !== -1) {
      kycStatusData = kycStatusMapperInvest["ground_premium"];
    }
  }
  let isReadyToInvestBase = isReadyToInvest();
  let kycJourneyStatusMapperData = kycStatusMapper[kycJourneyStatus];

  this.setState({
    isCompliant,
    kycStatusData,
    kycJourneyStatusMapperData,
    userKyc,
    kycJourneyStatus,
    isReadyToInvestBase,
    getKycAppStatusData,
  });
  let bottom_sheet_dialog_data_premium = {};
  let premium_onb_status = "";
  if (isCompliant) {
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
      bottom_sheet_dialog_data_premium = kycStatusMapper["complete"];
      bottom_sheet_dialog_data_premium.status = premium_onb_status;
    }

    if (["rejected"].indexOf(kycJourneyStatus) !== -1) {
      bottom_sheet_dialog_data_premium = kycStatusMapper[premium_onb_status];
      bottom_sheet_dialog_data_premium.status = premium_onb_status;
    }
  }

  this.setState({ bottom_sheet_dialog_data_premium });
  if (premium_onb_status && !isEmpty(bottom_sheet_dialog_data_premium)) {
    let banklist = storageService().getObject("banklist");
    if (banklist && banklist.length) {
      return;
    } else {
      this.openPremiumOnboardBottomSheet(
        bottom_sheet_dialog_data_premium,
        userKyc
      );
    }
  }
}

export function openPremiumOnboardBottomSheet(
  bottom_sheet_dialog_data_premium,
  userKyc
) {
  let is_bottom_sheet_displayed_kyc_premium = storageService().get(
    "is_bottom_sheet_displayed_kyc_premium"
  );

  if (is_bottom_sheet_displayed_kyc_premium) {
    return "";
  }

  if (getConfig().Web && this.state.screenName !== "invest_landing") {
    return;
  }

  if (!getConfig().Web && this.state.screenName !== "landing") {
    return;
  }

  storageService().set("is_bottom_sheet_displayed_kyc_premium", true);
  if (userKyc.bank.meta_data_status === "rejected") {
    this.setState({ verificationFailed: true });
  } else {
    this.setState({
      modalData: bottom_sheet_dialog_data_premium,
      openKycPremiumLanding: true,
    });
  }
}

export function openKyc() {
  let {
    userKyc,
    kycJourneyStatus,
    kycStatusData,
    kycJourneyStatusMapperData,
  } = this.state;
  if (kycJourneyStatus === "submitted" || kycJourneyStatus === "rejected") {
    if (userKyc.bank.meta_data_status === "rejected") {
      this.setState({ verificationFailed: true });
    } else {
      let modalData = kycJourneyStatusMapperData;
      this.setState({ modalData, openKycStatusDialog: true });
    }
  } else {
    if (kycJourneyStatus === "ground") {
      this.navigate("/kyc/home");
    } else if (kycJourneyStatus === "ground_pan") {
      this.navigate("/kyc/journey", {
        state: {
          show_aadhaar: !userKyc.address.meta_data.is_nri ? true : false,
          fromState: "invest",
        },
      });
    } else {
      this.navigate(kycStatusData.next_state, {
        state: { fromState: "invest" },
      });
    }
  }
}

export const resetRiskProfileJourney = () => {
  storageService().set("came_from_risk_webview", "");
  storageService().set("firsttime_from_risk_webview_invest", "");
  return;
};
function handleInvestSubtitle (partner = '')  {
  let investCardSubtitle = 'Mutual funds, Save tax';

  if (partner) {
    let invest_screen_cards = partner.invest_screen_cards;
    investCardSubtitle = 'Mutual funds';
    if (invest_screen_cards?.gold) {
      investCardSubtitle = investCardSubtitle += ', Gold, Save tax';
    } else {
      investCardSubtitle = 'Mutual funds, Save tax';
    }

    if (invest_screen_cards?.nps) {
      investCardSubtitle = investCardSubtitle += ', NPS';
    }
  }
  return investCardSubtitle;
};

export function handleRenderCard() {
  let userKyc = this.state.userKyc || storageService().getObject("kyc") || {};
  let partner = this.state.partner || storageService().getObject("partner") || {};
  let currentUser = this.state.currentUser || storageService().getObject("user") || {};
  let isReadyToInvestBase = isReadyToInvest();
  const isWeb =getConfig().Web;
  const hideReferral = currentUser.active_investment && !isWeb && !partner?.feature_manager?.hide_share_refferal;
  const referralCode = !currentUser.active_investment && !isWeb && !partner?.feature_manager?.hide_apply_refferal;
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
        el.subtitle = handleInvestSubtitle(partner)
      }
      return true;
    }
  })
  this.setState({renderLandingCards : cards});
}
