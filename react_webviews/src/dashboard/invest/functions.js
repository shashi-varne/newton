import Api from "utils/api";
import { storageService } from "utils/validators";
import toast from "../../common/ui/Toast";
import { getConfig } from "utils/functions";
import { apiConstants, investCardsBase, keyPathMapper } from "./constants";

let errorMessage = "Something went wrong!";
export async function initialize() {
  //   let isLoggedIn = storageService().get("currentUser");

  //   if (!isLoggedIn) {
  //     this.props.history.push({
  //       pathname: "login",
  //       search: getConfig().searchParams,
  //     });
  //   }
  this.getSummary = getSummary.bind(this);
  this.setSummaryData = setSummaryData.bind(this);
  this.setInvestCardsData = setInvestCardsData.bind(this);
  this.getRecommendationApi = getRecommendationApi.bind(this);
  this.getRecommendedPlans = getRecommendedPlans.bind(this);
  this.getRateOfInterest = getRateOfInterest.bind(this);
  this.corpusValue = corpusValue.bind(this);
  this.navigate = navigate.bind(this);
  this.clickCard = clickCard.bind(this);
  if (this.state.screenName === "invest_landing") {
    this.getSummary();
  }
  if (this.onload) this.onload();
}

export async function getSummary() {
  this.setState({ showLoader: true, loaderMessage: "Please wait..." });
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
      this.setState({ showLoader: false });
    } else {
      this.setState({ showLoader: false });
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ showLoader: false });
    toast(errorMessage);
  }
}

export function setSummaryData(result) {
  let currentUser = result.data.user.user.data;
  let userKyc = result.data.kyc.kyc.data;
  //   _user = result.data.user.user.data;
  //   _kyc = result.data.kyc.kyc.data;
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
    // sections =  ['notification', 'profile', 'in_flow', 'landing'];
  }

  if (!notifications) {
    notifications = storageService().getObject("campaign") || [];
  }

  var notificationsData = [];

  for (var i = 0; i < notifications.length; i++) {
    if (notifications[i].campaign.name === "PlutusPendingTransactionCampaign") {
      continue;
    }

    notificationsData.push(notifications[i]);
    // for (var j = 0; j < notifications[i].notification_visual_data.target.length; j++) {
    //   var camTarget = notifications[i].notification_visual_data.target[j];
    //   if (sections.indexOf(camTarget.section) !== -1 ) {
    //     notificationsData.push(notifications[i]);
    //     break;
    //   }
    // }
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
        console.log(result);
        if (!result.data.registration_details.additional_details_status) {
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
  let { partner } = this.state || {};
  if (!partner.invest_screen_cards) {
    partner.invest_screen_cards = {
      nps: false,
      gold: false,
    };
  }
  let insuranceDisabled = [
    "lvb",
    "cccb",
    "sury",
    "obc",
    "svcho",
    "alb",
    "ktb",
    "sbm",
    "cub",
  ];
  let npsDisabled = ["cccb", "sury", "obc", "svcho", "ktb", "sbm", "cub"];
  let goldDisabled = [
    "apna",
    "lvb",
    "cccb",
    "sury",
    "obc",
    "svcho",
    "alb",
    "ktb",
    "cub",
  ];
  let referralData = storageService().getObject("referral");
  let referral = {};
  let subbroker_code = {};
  if (referralData) {
    referral = referralData.subbroker.data;
    if (referral) {
      subbroker_code = referral.subbroker_code;
    }
  }
  if (partner.code === "bfdlmobile") {
    investCardsBase["our_recommendations"]["instaredeem"].title = "Money +";
  }

  let invest_cards_handling_common = {
    our_recommendations: [
      "instaredeem",
      "buildwealth",
      "insurance",
      "savetax",
      "nps",
    ],
    diy: ["diyv2", "gold"],
    bottom_scroll_cards: ["parkmoney", "savegoal"],
    bottom_cards: ["nfo"],
    popular_cards: [],
  };

  let restricted_items = ["gold", "nps", "risk_profile", "insurance"];

  let invest_cards_handling_partner = partner.invest_cards_handling;

  let invest_show_data = {};

  let invest_render_cards_common = [
    "kyc",
    "our_recommendations",
    "diy",
    "bottom_scroll_cards",
    "bottom_cards",
    "financial_tools",
  ];
  let render_cards = partner.invest_render_cards || invest_render_cards_common;

  this.setState({ render_cards: render_cards });
  let keys_for_handling = [
    "our_recommendations",
    "diy",
    "bottom_scroll_cards",
    "bottom_cards",
    "popular_cards",
  ];

  for (let handling_key of keys_for_handling) {
    invest_show_data[handling_key] = [];
    let partner_specific = invest_cards_handling_common[handling_key];
    if (
      invest_cards_handling_partner &&
      invest_cards_handling_partner[handling_key] &&
      invest_cards_handling_partner[handling_key].length !== 0
    ) {
      partner_specific = invest_cards_handling_partner[handling_key];
    }
    for (let itemKey of partner_specific) {
      if (
        restricted_items.indexOf(itemKey) !== -1 &&
        !partner.invest_screen_cards[itemKey]
      ) {
        continue;
      } else if (
        subbroker_code &&
        itemKey === "insurance" &&
        insuranceDisabled.indexOf(subbroker_code) !== -1
      ) {
        continue;
      } else if (
        subbroker_code &&
        itemKey === "nps" &&
        npsDisabled.indexOf(subbroker_code) !== -1
      ) {
        continue;
      } else if (
        subbroker_code &&
        itemKey === "gold" &&
        goldDisabled.indexOf(subbroker_code) !== -1
      ) {
        continue;
      }
      let handleObject = investCardsBase[handling_key][itemKey];
      handleObject.key = itemKey;
      invest_show_data[handling_key].push(handleObject);
    }
  }
  this.setState({ invest_show_data: invest_show_data });
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
      // handle kyc
      break;
    case "insurance":
      let insurancePath = "/group-insurance";
      window.location.href = getPath(insurancePath);
      break;
    case "gold":
      let goldPath = "/gold/my-gold";
      window.location.href = getPath(goldPath);
      break;
    case "fhc":
      let fhcPath = "/fhc";
      window.location.href = getPath(fhcPath);
      break;
    case "risk_profile":
      let riskProfilePath = "/risk/result";
      window.location.href = getPath(riskProfilePath);
      break;
    case "top_equity":
      this.navigate(`/diy/fundlist/Top equity funds/Multi_Cap/Equity`);
      break;
    default:
      this.navigate(keyPathMapper[state] || state);
      break;
  }
}

function getPath(path) {
  let redirectUrl =
    window.location.href.indexOf("&is_secure=") === -1
      ? `${window.location.href}&is_secure=${storageService().get("is_secure")}`
      : window.location.href;
  redirectUrl = encodeURIComponent(redirectUrl);
  return (
    window.location.protocol +
    "//" +
    window.location.host +
    path +
    getConfig().searchParams +
    "&generic_callback=true&redirect_url=" +
    redirectUrl
  );
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
    showLoader: true,
    loaderMessage: "Please wait...",
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
      data.stockSplit = result.recommendation.equity;
      data.bondSplit = result.recommendation.debt;
      this.setState({ stockSplit: data.stockSplit, bondSplit: data.bondSplit });
      let date = new Date();
      let graphdata = {
        recommendation: result.recommendation,
        amount: data.amount,
        term: data.term,
        year: parseInt(date.getFullYear() + data.term, 10),
        corpus: this.corpusValue(data),
        investType: data.investType,
        investTypeDisplay: "sip",
        name: "Wealth building",
        isSliderEditable: result.recommendation.editable,
        stockSplit: result.recommendation.equity,
        bondSplit: result.recommendation.debt,
        graphType: data.investType,
      };
      storageService().setObject("graphdata", graphdata);
      if (amount === 300) {
        this.navigate(
          `/invest/buildwealth/${graphdata.amount}/${graphdata.year}/${graphdata.investType}/${graphdata.corpus}/${graphdata.stockSplit}`
        );
      } else {
        this.getRecommendedPlans();
      }
      this.setState({ showLoader: false });
    } else {
      this.setState({ showLoader: false });
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ showLoader: false });
    toast(errorMessage);
  }
}

function getRateOfInterest(data) {
  let range = Math.abs(data.stockReturns - data.bondReturns);
  if (data.stockSplit < 1) {
    return data.bondReturns;
  } else if (data.stockSplit > 99) {
    return data.stockReturns;
  } else {
    let rateOffset = (range * data.stockSplit) / 100;
    return data.bondReturns + rateOffset;
  }
}

export function corpusValue(data) {
  let principle = data.amount;
  let corpus_value = 0;
  for (var i = 0; i < data.term; i++) {
    if (this.state.isRecurring || data.investType === "buildwealth") {
      // isRecurring not initialised
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

export async function getRecommendedPlans() {
  try {
    const res = await Api.get(apiConstants.getRecommendation, {
      type: this.state.investType,
      amount: this.state.amount,
      term: this.state.term,
      subType: this.state.subType, // not initailised
      equity: this.state.stockSplit,
      debt: this.state.bondSplit,
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      let graphdata = {
        allocations: result.recommendation,
        alternatives: result.alternatives,
        amount: result.amount,
        term: this.state.term,
        investType: this.state.investType,
        name: this.state.investName, // not initailised
        subType: this.state.subType,
        graphType: this.state.graphType, // not initailised
        investTypeDisplay: this.state.investTypeDisplay, // not initailised
        stock: this.state.stockSplit,
        bond: this.state.bondSplit,
      };
      storageService().setObject("recommendations", graphdata);
      this.navigate("/recommendations");
      this.setState({ showLoader: false });
    } else {
      this.setState({ showLoader: false });
      toast(result.message || result.error || errorMessage);
    }
  } catch (error) {
    console.log(error);
    this.setState({ showLoader: false });
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
    });
  }
}
