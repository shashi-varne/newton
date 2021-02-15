import Api from "utils/api";
import { storageService, formatAmountInr } from "utils/validators";
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
  this.initializeInstaRedeem = initializeInstaRedeem.bind(this);
  this.getInstaRecommendation = getInstaRecommendation.bind(this);
  this.getRecommendation = getRecommendation.bind(this);
  this.validateAmount = validateAmount.bind(this);
  this.showFundInfo = showFundInfo.bind(this);
  this.detailView = detailView.bind(this);
  this.getNfoRecommendation = getNfoRecommendation.bind(this);
  this.getNfoPurchaseLimit = getNfoPurchaseLimit.bind(this);
  this.checkLimit = checkLimit.bind(this);
  this.proceedInvestment = proceedInvestment.bind(this);
  this.makeInvestment = makeInvestment.bind(this);
  this.proceedInvestmentChild = proceedInvestmentChild.bind(this);
  this.getDiyPurchaseLimit = getDiyPurchaseLimit.bind(this);
  this.deleteFund = deleteFund.bind(this);
  if (this.state.screenName === "invest_landing") {
    this.getSummary();
  }
  if (this.onload) this.onload();
}

export async function getSummary() {
  this.setState({ show_loader: true, loadingText: "Please wait..." });
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
        storageService().setObject("nps_additional_details", result.registration_details);
        console.log(result.registration_details)
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
    show_loader: true,
    loadingText: "Please wait...",
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
      storageService().setObject("graphData", graphdata);
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

export async function getRecommendedPlans(amount) {
  try {
    const res = await Api.get(apiConstants.getRecommendation, {
      type: this.state.investType,
      amount: amount,
      term: this.state.term,
      subType: this.state.subType, // not initailised
      equity: this.state.stockSplit,
      debt: this.state.bondSplit,
    });
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      let graphdata = {
        recommendation: result.recommendation,
        alternatives: result.alternatives,
        amount: result.amount,
        term: this.state.term,
        investType: this.state.investType,
        name: this.state.investName, // not initailised
        subType: this.state.subType,
        graphType: this.state.investType,
        investTypeDisplay: this.state.investTypeDisplay, // not initailised
        stock: this.state.stockSplit,
        bond: this.state.bondSplit,
      };
      storageService().setObject("graphData", graphdata);
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
    });
  }
}

export function initializeInstaRedeem() {
  if (storageService().get("instaRecommendations")) {
    let instaRecommendation = storageService().getObject(
      "instaRecommendations"
    )[0];
    this.setState({
      instaRecommendation: instaRecommendation,
    });
  } else {
    this.getInstaRecommendation();
  }
}

export async function getInstaRecommendation() {
  this.setState({ show_loader: true, loadingText: "Please wait..." });
  try {
    const res = await Api.get(apiConstants.getInstaRecommendation);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      storageService().setObject("instaRecommendations", result.mfs);
      storageService().setObject("goalRecommendations", result.itag);
      let instaRecommendation = result.mfs[0];
      this.setState({
        show_loader: false,
        instaRecommendation: instaRecommendation,
      });
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export function showFundInfo(data) {
  let recommendation = { mf: data };
  let dataCopy = Object.assign({}, recommendation);
  dataCopy.diy_type = "recommendation";
  dataCopy.invest_type_from = "instaredeem";
  storageService().setObject("diystore_fundInfo", dataCopy);
  this.props.history.push({
    pathname: "/fund-details",
    search: `${getConfig().searchParams}&isins=${data.isin}`,
  });
}

export async function getRecommendation() {
  this.setState({ show_loader: true, loadingText: "Please wait..." });
  let instaRecommendations = storageService().getObject(
    "instaRecommendations"
  )[0];
  let { amount, investType, term } = this.state;
  let allocations = [{ amount: amount, mf: instaRecommendations }];
  let recommendations = {
    recommendation: allocations,
    term: term,
    investType: "insta-redeem",
    name: "Insta Redeem",
    investTypeDisplay: investType,
    bondstock: "",
    amount: parseInt(amount, 10),
    type: "insta-redeem",
    order_type: investType,
    subtype: "",
  };
  storageService().setObject("graphData", recommendations);
  this.navigate(`/invest/recommendations`);
}

function getGoalRecommendations() {
  let goal = storageService().getObject("goalRecommendations");
  if (!goal) {
    goal = {};
  }

  let result = {
    min_sip_amount: goal.min_sip_amount ? goal.min_sip_amount : 500,
    max_sip_amount: goal.max_sip_amount ? goal.max_sip_amount : 500000,
    min_ot_amount: goal.min_ot_amount ? goal.min_ot_amount : 5000,
    max_ot_amount: goal.max_ot_amount ? goal.max_ot_amount : 2000000,
  };
  return result;
}

function validateAmount(amount) {
  let goal = getGoalRecommendations();
  let max = 0;
  let min = 0;
  if (this.state.investType === "sip") {
    max = goal.max_sip_amount;
    min = goal.min_sip_amount;
  } else {
    max = goal.max_ot_amount;
    min = goal.min_ot_amount;
  }
  let { amount_error } = this.state;
  if (amount > max) {
    amount_error =
      "Investment amount cannot be more than " + formatAmountInr(max);
  } else if (amount < min) {
    amount_error = "Minimum amount should be atleast " + formatAmountInr(min);
  } else {
    amount_error = "";
  }
  this.setState({ amount_error: amount_error });
}

export function detailView(fund) {
  storageService().setObject("nfo_detail_fund", fund);
  this.props.history.push(
    {
      pathname: `/advanced-investing/new-fund-offers/fund`,
      search: getConfig().searchParams,
    },
    {
      mfid: fund.mfid,
    }
  );
}

export function getFormattedStartDate(input) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (p1 < 10 ? "0" + p1 : p1) + " " + months[p2 - 1];
    });
  }
}

export function getFormattedEndDate(input) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (p1 < 10 ? "0" + p1 : p1) + " " + months[p2 - 1] + " " + p3;
    });
  }
}

export function getSchemeOption(text) {
  if (!text) {
    return null;
  } else {
    return text.split("_").join(" ");
  }
}

export async function getNfoRecommendation() {
  this.setState({ show_loader: true });
  try {
    const res = await Api.get(apiConstants.getNfoRecommendation);
    const { result, status_code: status } = res.pfwresponse;
    if (status === 200) {
      storageService().remove("nfo_cart");
      storageService().remove("nfo_cartCount");
      let sortedArray = result.recommendations.filter((item) => {
        return item.growth_or_dividend === this.state.scheme;
      });
      var newArray = sortedArray.map((dict) => {
        dict["addedToCart"] = false;
        dict["allow_purchase"] = true;
        return dict;
      });
      storageService().setObject("nfo_fundsList", newArray);
      let nfoFunds = newArray;
      let cartCount = 0;
      let showFunds = nfoFunds.length > 0;
      this.setState({
        show_loader: false,
        nfoFunds: nfoFunds,
        cartCount: cartCount,
        showFunds: showFunds,
      });
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export async function getNfoPurchaseLimit(data) {
  this.setState({ show_loader: true });
  try {
    const res = await Api.get(
      `${apiConstants.getPurchaseLimit}${data.investType}?type=isin&isins=${data.isins}`
    );
    const { result, status_code: status } = res.pfwresponse;
    let { fundsData } = this.state;
    if (status === 200) {
      let purchaseLimitData = result.funds_data;
      let disableInputSummary = true;
      if (purchaseLimitData[0].ot_sip_flag) {
        fundsData[0].allow_purchase = true;
        disableInputSummary = false;
      }
      this.setState({
        show_loader: false,
        fundsData: fundsData,
        purchaseLimitData: purchaseLimitData,
        disableInputSummary: disableInputSummary,
      });
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export async function getDiyPurchaseLimit(data) {
  this.setState({ show_loader: true });
  try {
    const res = await Api.get(
      `${apiConstants.getPurchaseLimit}${data.investType}?type=isin&isins=${data.isins}`
    );
    const { result, status_code: status } = res.pfwresponse;
    let { fundsData } = this.state;
    if (status === 200) {
      let purchaseLimitData = result.funds_data;
      purchaseLimitData = purchaseLimitData.map((dict) => {
        var results = fundsData.filter((obj) => {
          if (obj.isin === dict["isin"]) {
            obj["allow_purchase"] = dict["ot_sip_flag"];
          }
          return obj;
        });
        dict["addedToCart"] = false;
        dict["allow_purchase"] = true;
        if (results.length === 0) {
          dict["addedToCart"] = false;
        }
        return dict;
      });

      let isDisabledFundCount = 0;
      this.setState({
        show_loader: false,
        fundsData: fundsData,
        purchaseLimitData: purchaseLimitData,
        isDisabledFundCount: isDisabledFundCount,
      });
    }
  } catch (error) {
    console.log(error);
    this.setState({ show_loader: false });
    toast(errorMessage);
  }
}

export function deleteFund(item, index) {
  let { fundsData, cartCount } = this.state;
  let fundName = item.legalName || item.legal_name;
  fundsData.splice(index, 1);
  cartCount = fundsData.length;
  this.setState({
    fundName: fundName,
    fundsData: fundsData,
    cartCount: cartCount,
  });
  storageService().setObject("diystore_cart", fundsData);
  storageService().set("diystore_cartCount", fundsData.length);
}

export function checkLimit(amount, index) {
  let {
    purchaseLimitData,
    form_data,
    disableInputSummary,
    disableInput,
    fundsData,
  } = this.state;
  let limitData = purchaseLimitData.find(
    (data) => data.isin === fundsData[index].isin
  );
  if (!limitData) return;
  let min = limitData.addl_purchase.min;
  let max = limitData.addl_purchase.max;
  let mul = limitData.addl_purchase.mul;

  if (amount < min) {
    form_data[index].amount_error =
      "Please add atleast " + formatAmountInr(min) + " to proceed.";
    disableInput[index] = 1;
  } else if (amount % mul !== 0) {
    form_data[index].amount_error =
      "Amount must be multiple of " + formatAmountInr(mul);
    disableInput[index] = 1;
  } else if (amount > max) {
    disableInput[index] = 1;
    form_data[index].amount_error =
      "Maximum amount for this fund is " + formatAmountInr(max);
  } else {
    disableInput[index] = 0;
    form_data[index].amount_error = "";
  }

  let value = disableInput.reduce((total, num) => {
    return total + num;
  });

  if (value === 0) disableInputSummary = false;
  else disableInputSummary = true;

  this.setState({
    disableInputSummary: disableInputSummary,
    form_data: form_data,
  });
}

function isInvestRefferalRequired(partner_code) {
  if (partner_code === "ktb") {
    return true;
  }
  return false;
}

export async function proceedInvestment(event, isReferralGiven) {
  let {
    partner_code,
    fundsData,
    purchaseLimitData,
    investType,
    totalAmount,
  } = this.state;
  if (isInvestRefferalRequired(partner_code) && !isReferralGiven) {
    // let investCtaEvents = event;
    // $rootScope.openPopupInvestReferral(refOnKey);
    return;
  }

  let allocations = [];
  fundsData
    .filter((data) => data.allow_purchase)
    .forEach((fund) => {
      let limitData = purchaseLimitData.find(
        (element) => element.isin === fund.isin
      );
      if (!limitData) return;
      let allocation = {
        mfid: limitData.mfid,
        mfname: limitData.mfname,
        amount: totalAmount,
        default_date: limitData.addl_purchase.default_date,
        sip_dates: limitData.addl_purchase.sip_dates,
      };
      allocations.push(allocation);
    });
  let investment = {};
  investment.amount = parseFloat(totalAmount);
  let investment_type = "";
  if (investType === "onetime") {
    investment.type = "diy";
    investment_type = "onetime";
  } else {
    investment.type = "diysip";
    investment_type = "sip";
  }

  let paymentRedirectUrl = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}/page/callback/${investment_type}/${investment.amount}`
  );

  investment.allocations = allocations;
  window.localStorage.setItem("investment", JSON.stringify(investment));
  this.setState(
    {
      investment_type: investment_type,
      paymentRedirectUrl: paymentRedirectUrl,
    },
    () => this.makeInvestment(event, investment, isReferralGiven)
  );
}

export async function makeInvestment(event, investment, isReferralGiven) {
  let {
    isRedirectToPayment,
    investment_type,
    invRefData,
    totalAmount,
    type,
    currentUser,
    partner_code,
  } = this.state;

  isRedirectToPayment = true;
  let investmentObj = investment;
  let body = {
    investment: investmentObj,
  };

  let investmentEventData = {
    amount: parseFloat(totalAmount),
    investment_type: investment_type,
    investment_subtype: "",
    journey_name: type,
  };

  storageService().setObject("mf_invest_data", investmentEventData);

  if (
    !currentUser.active_investment &&
    partner_code !== "bfdlmobile" &&
    type === "diy"
  ) {
    this.navigate("/invest-journey");
  }

  if (isReferralGiven && invRefData.code) {
    body.referral_code = invRefData.code;
  }
  this.setState(
    {
      isApiRunning: true,
      sipOrOnetime: investment_type,
      body: body,
      isRedirectToPayment: isRedirectToPayment,
      investmentEventData: investmentEventData,
    },
    () => this.proceedInvestmentChild(event)
  );

  // $broadcast ('parentChildCommunication', {key: 'proceedInvestmentChild'});
}

export async function proceedInvestmentChild(ev) {
  if (this.state.isKycNeeded) {
    // this.state.redirectToKyc();
    return;
  }
  if (this.state.sipOrOnetime === "sip" && !this.state.isSipDatesScreen) {
    storageService().setObject("investmentObjSipDates", this.state.body);
    this.navigate("/sipdates");
  } else {
    let { investmentEventData } = this.state;
    if (investmentEventData) {
      investmentEventData = storageService().getObject("mf_invest_data") || {};
    }

    try {
      const res = await Api.post(
        apiConstants.triggerInvestment,
        this.state.body
      );
      const { result, status_code: status } = res.pfwresponse;
      if (status === 200) {
        // eslint-disable-next-line
        let pgLink = result.investments[0].pg_link;
        pgLink +=
          // eslint-disable-next-line
          (pgLink.match(/[\?]/g) ? "&" : "?") +
          "redirect_url=" +
          this.state.paymentRedirectUrl;

        investmentEventData["payment_id"] = result.investments[0].id;
        storageService().setObject("mf_invest_data", investmentEventData);

        // if (this.state.isSipDatesScreen) {
        //   $scope.successDialog(ev);
        //   $scope.$parent.investResponse = data;
        //   return;
        // }

        //  handle callbackWeb.isWeb()
      } else {
        // handle error
      }
    } catch (error) {
      console.log(error);
      this.setState({ show_loader: false });
      toast(errorMessage);
    }
  }
}
