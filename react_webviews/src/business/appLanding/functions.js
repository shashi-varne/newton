import {
  AUTH_VERIFICATION_DATA,
  BOTTOMSHEET_KEYS,
  INVESTMENT_OPTIONS,
  RESTRICTED_FEATURES,
  WEBAPP_LANDING_PATHNAME_MAPPER,
} from "../../constants/webappLanding";
import {
  getBasePath,
  getConfig,
  getPartnerName,
  isTradingEnabled,
} from "../../utils/functions";
import { getPartnerData } from "../../utils/partnerConfigs";
import {
  splitMobileNumberFromContryCode,
  storageService,
} from "../../utils/validators";
import { get, isEmpty, isFunction } from "lodash-es";
import { nativeCallback } from "../../utils/native_callback";
import {
  kycStatusMapper,
  premiumBottomSheetMapper,
} from "../../dashboard/Invest/constants";
import { getAccountSummary } from "businesslogic/apis/common";
import eventManager from "../../utils/eventManager";
import { EVENT_MANAGER_CONSTANTS } from "../../utils/constants";
import { getCampaignData } from "businesslogic/utils/app/functions";
import {
  getNPSInvestmentStatus,
  hitCampaignFeedbackUrl,
} from "businesslogic/apis/app";
import store from "../../dataLayer/store";
import {
  setBankList,
  setCampaign,
  setKyc,
  setNps,
  setPartner,
  setReferral,
  setSubscriptionStatus,
  setUser,
  updateAppStorage,
} from "businesslogic/dataStore/reducers/app";
import Api from "../../utils/api";
import { FREEDOM_PLAN_STORAGE_CONSTANTS } from "../../freedom_plan/common/constants";
import { isEquityCompleted } from "../../kyc/common/functions";

/* eslint-disable */
export const initData = async () => {
  const currentUser = storageService().get("currentUser");
  const user = storageService().getObject("user");
  const kyc = storageService().getObject("kyc");
  if (currentUser && !isEmpty(user) && !isEmpty(kyc)) {
    const referral = storageService().getObject("referral");
    if (isEmpty(referral)) {
      const queryParams = {
        campaign: ["user_campaign"],
        nps: ["nps_user"],
        bank_list: ["bank_list"],
        referral: ["subbroker", "p2p"],
        equity: ["subscription_status"],
      };
      const result = await getAccountSummary(Api, queryParams);
      storageService().set("dataSettedInsideBoot", true);
      setSDKSummaryData(result);
      store.dispatch(
        updateAppStorage({
          dataSettedInsideBoot: true,
        })
      );
    }
  } else {
    const result = await getAccountSummary(Api);
    storageService().set("dataSettedInsideBoot", true);
    setSummaryData(result);
    store.dispatch(
      updateAppStorage({
        dataSettedInsideBoot: true,
      })
    );
  }
};

export const setSummaryData = (result, skipStoreUpdate = false) => {
  const currentUser = result.data.user.user.data;
  const userKyc = result.data.kyc.kyc.data;
  const subscriptionStatus =
    result?.data?.equity?.subscription_status?.data || {};
  storageService().set("currentUser", true);
  storageService().setObject("user", currentUser);
  storageService().setObject("kyc", userKyc);

  const campaignData = getCampaignData(result.data.campaign.user_campaign.data);
  const referral = result.data.referral;
  const bankList = result?.data?.bank_list?.bank_list?.data;
  const nps = result?.data?.nps?.nps_user?.data;
  storageService().setObject("campaign", campaignData);
  storageService().setObject("npsUser", nps);
  storageService().setObject("banklist", bankList);
  storageService().setObject("referral", referral);
  if (!isEmpty(subscriptionStatus)) {
    storageService().setObject(
      FREEDOM_PLAN_STORAGE_CONSTANTS.subscriptionStatus,
      subscriptionStatus
    );
  }
  let partner = "";
  let consent_required = false;
  if (result.data.partner.partner.data) {
    partner = result.data.partner.partner.data.name;
    consent_required = result.data.partner.partner.data.consent_required;
  }
  storageService().set("consent_required", consent_required);
  const subbrokerCode = result.data.referral.subbroker.data.subbroker_code;
  const subBrokerCodePartersList = [
    "hbl",
    "sbm",
    "flexi",
    "medlife",
    "life99",
    "taxwin",
    "ippb",
    "quesscorp",
    "sahaj",
    "mspl",
  ];
  partner = getPartnerName(partner);
  if (subBrokerCodePartersList.includes(subbrokerCode)) {
    partner = subbrokerCode;
  }
  storageService().set("partner", partner);
  if (!skipStoreUpdate) {
    store.dispatch(setKyc(userKyc));
    store.dispatch(setUser(currentUser));
    store.dispatch(setCampaign(campaignData));
    store.dispatch(setNps(nps));
    store.dispatch(setReferral(referral));
    store.dispatch(setBankList(bankList));
    store.dispatch(setSubscriptionStatus(subscriptionStatus));
  }
  store.dispatch(setPartner(partner));
  eventManager.emit(EVENT_MANAGER_CONSTANTS.updateAppTheme);
  setNpsData(result);
};

const setSDKSummaryData = (result) => {
  const subscriptionStatus =
    result?.data?.equity?.subscription_status?.data || {};
  if (!isEmpty(subscriptionStatus)) {
    storageService().setObject(
      FREEDOM_PLAN_STORAGE_CONSTANTS.subscriptionStatus,
      subscriptionStatus
    );
  }
  const campaignData = getCampaignData(result.data.campaign.user_campaign.data);
  const nps = result.data.nps.nps_user.data;
  const bankList = result?.data?.bank_list?.bank_list?.data;
  const referral = result.data.referral;
  storageService().setObject("campaign", campaignData);
  storageService().setObject("npsUser", nps);
  storageService().setObject("banklist", bankList);
  storageService().setObject("referral", referral);
  store.dispatch(setCampaign(campaignData));
  store.dispatch(setNps(nps));
  store.dispatch(setReferral(referral));
  store.dispatch(setBankList(bankList));
  store.dispatch(setSubscriptionStatus(subscriptionStatus));
  setNpsData(result);
};

const setNpsData = async (result) => {
  if (
    result?.data?.user?.user?.data?.nps_investment &&
    result?.data?.nps?.nps_user?.data?.is_doc_required
  ) {
    try {
      const data = await getNPSInvestmentStatus(Api);
      storageService().setObject(
        "nps_additional_details",
        data.registration_details
      );
      storageService().setObject("nps_data", data);
      if (!data?.registration_details?.additional_details_status) {
        storageService().set("nps_additional_details_required", true);
      } else {
        storageService().set("nps_additional_details_required", false);
      }
    } catch (err) {
      console.log("err ", err);
    }
  } else {
    storageService().set("nps_additional_details_required", false);
  }
};

export const getInvestCardsData = (
  investSections = [],
  feature,
  fallbackOptions,
  maximumProducts
) => {
  const config = getConfig();
  let isMfOnly = false,
    showPortfolioOverview = false;
  let data = getEnabledFeaturesData(config, investSections, feature);
  const user = get(store.getState(), "app.user", {});

  let { cardsData, featureIndex } = data;
  if (featureIndex !== -1) {
    const selectedCardData = cardsData.find((el) => el.id === feature);
    cardsData = cardsData.filter((el) => el.id !== feature);
    if (!isEmpty(selectedCardData)) {
      cardsData.unshift(selectedCardData);
    }
    data.cardsData = cardsData;
  }

  const FEATURES_TO_ENABLE_PORTFOLIO = ["mf", "taxFiling"];
  if (
    user.active_investment &&
    data.cardsData.length <= FEATURES_TO_ENABLE_PORTFOLIO.length
  ) {
    showPortfolioOverview = true;
    data.cardsData.forEach((el) => {
      if (!FEATURES_TO_ENABLE_PORTFOLIO.includes(el.id)) {
        showPortfolioOverview = false;
      }
    });
  }
  if (data.cardsData.length === 1) {
    isMfOnly = true;
    if (!isEmpty(fallbackOptions)) {
      data = getEnabledFeaturesData(config, fallbackOptions, feature);
    }
  } else if (maximumProducts && data.cardsData.length > maximumProducts) {
    data.cardsData.splice(
      maximumProducts - 1,
      4,
      INVESTMENT_OPTIONS.categoryViewAll
    );
  }

  return {
    investCardsData: data.cardsData,
    isMfOnly,
    showPortfolioOverview,
    enabledFeatures: data.enabledFeatures,
  };
};

export const getEnabledFeaturesData = (config, investOptions, feature) => {
  const { productName, features = {} } = config;
  const state = store.getState();
  const referralData = get(state, "app.referral", {});
  const kyc = get(state, "app.kyc", {});
  let subbrokerCode = "";
  let subbrokerFeatures = {};
  if (referralData?.subbroker?.data) {
    subbrokerCode = referralData.subbroker.data.subbroker_code;
    if (["fisdom", "finity"].includes(subbrokerCode)) {
      subbrokerCode = "";
    } else {
      const subbrokerData = getPartnerData(productName, subbrokerCode);
      subbrokerFeatures = subbrokerData.features || {};
    }
  }

  let cardsData = [],
    featureIndex = -1;

  investOptions.forEach((section, index) => {
    if (
      RESTRICTED_FEATURES.includes(section) &&
      ((subbrokerCode && !subbrokerFeatures[section]) || !features[section])
    ) {
      return;
    } else if (["stocks", "ipo"].includes(section) && !isTradingEnabled(kyc)) {
      return;
    } else {
      const cardData = INVESTMENT_OPTIONS[section];
      if (!isEmpty(cardData)) {
        cardsData.push(cardData);
        if (feature === section) {
          featureIndex = index;
        }
      }
    }
  });
  const enabledFeatures = !isEmpty(subbrokerCode)
    ? subbrokerFeatures
    : features;
  return { cardsData, featureIndex, enabledFeatures };
};

export const getEnabledMarketingBanners = (banners, enabledFeatures) => {
  return banners.filter(
    (data) =>
      dateValidation(data.endDate, data.startDate) &&
      validateFeature(data.id, enabledFeatures)
  );
};

export const dateValidation = (endDate, startDate) => {
  const date = new Date();
  const currentDate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  if (!endDate && !startDate) return true;
  const startDateInMs = Date.parse(startDate);
  const endDateInMs = Date.parse(endDate);
  const currentDateInMs = Date.parse(currentDate);
  if (
    startDate &&
    endDate &&
    startDateInMs <= endDateInMs &&
    startDateInMs <= currentDateInMs &&
    currentDateInMs <= endDateInMs
  ) {
    return true;
  }
  if (startDate && !endDate && startDateInMs <= currentDateInMs) {
    return true;
  }
  if (!startDate && endDate && currentDateInMs <= endDateInMs) {
    return true;
  }
  return false;
};

export const validateFeature = (type, enabledFeatures = {}) => {
  if (RESTRICTED_FEATURES.includes(type) && !enabledFeatures[type]) {
    return false;
  }
  const state = store.getState();
  const kyc = get(state, "app.kyc", {});
  if (["ipo", "stocks"].includes(type)) {
    return isTradingEnabled(kyc);
  } else if (type === "freedomplan") {
    return isFreedomPlanEnabled();
  } else if (type === "equityKyc") {
    return isTradingEnabled() && !isEquityCompleted();
  }
  return true;
};

export const isFreedomPlanEnabled = () => {
  const state = store.getState();
  const subscriptionStatus = get(state, "app.subscriptionStatus", {});
  const kyc = get(state, "app.kyc", {});
  return (
    isTradingEnabled(kyc) &&
    (subscriptionStatus?.freedom_cta || subscriptionStatus?.renewal_cta)
  );
};

export const getEnabledPlatformMotivators = (
  motivators,
  enabledFeatures = {}
) => {
  return motivators.filter((data) => validateFeature(data.id, enabledFeatures));
};

export const handleMarketingBanners = (
  data,
  sendEvents,
  navigate,
  openPageLoader
) => {
  const cardClick = data.eventStatus || data.id;
  sendEvents("next", {
    primaryCategory: "marketing banner carousel",
    cardClick,
  });
  if (data.actionUrl) {
    nativeCallback({
      action: "open_in_browser",
      message: {
        url: data.actionUrl,
      },
    });
    return;
  }
  if (data.id === "stocks") {
    openStocks(openPageLoader);
    return;
  }
  const path = WEBAPP_LANDING_PATHNAME_MAPPER[data.id] || "/";
  navigate(path);
};

export const openStocks = (openPageLoader) => {
  const config = getConfig();
  if (config.Web) {
    if (isFunction(openPageLoader)) {
      openPageLoader();
    }
    window.location.href = `${config.base_url}/page/equity/launchapp`;
  } else {
    nativeCallback({
      action: "open_equity",
    });
  }
};

export const getContactVerification = (
  kyc,
  isAuthVerificationDisplayed,
  screenName
) => {
  let contactData = {};
  const contactDetails = kyc?.identification?.meta_data;
  if (!isEmpty(contactDetails)) {
    if (contactDetails.mobile_number_verified === false) {
      const contactValue = splitMobileNumberFromContryCode(
        contactDetails?.mobile_number
      );
      contactData = {
        communicationType: "mobile",
        contactValue,
        contactNotVerified: true,
      };
    }
  }
  if (!isAuthVerificationDisplayed && screenName === "LANDING") {
    if (!isEmpty(contactDetails)) {
      let contactType,
        contactValue,
        countryCode,
        isVerified = true;
      if (
        !isEmpty(contactDetails.mobile_number) &&
        !contactDetails.mobile_number_verified
      ) {
        const [code, number] = contactDetails?.mobile_number?.toString().split("|");
        contactType = "mobile";
        isVerified = false;
        contactValue = number;
        countryCode = code;
      } else if (
        !isEmpty(contactDetails.email) &&
        !contactDetails.email_verified
      ) {
        contactType = "email";
        contactValue = contactDetails.email;
        isVerified = false;
      }
      if (!isVerified) {
        return {
          ...contactData,
          ...AUTH_VERIFICATION_DATA[contactType],
          countryCode,
          contactType,
          contactValue,
          showAuthVerification: true,
        };
      }
    }
  }
  return contactData;
};

export const getKycBottomsheetData = (
  kycData = {},
  appStorage = {},
  code,
  productName
) => {
  const {
    isCompliant,
    kycJourneyStatus,
    tradingEnabled,
    isMfInvested,
    kyc,
    user,
  } = kycData;
  let premiumDialogData = {};
  let premiumOnboardingStatus = "";
  if (
    isCompliant &&
    !tradingEnabled &&
    !appStorage.isPremiumBottomsheetDisplayed
  ) {
    premiumOnboardingStatus = kycJourneyStatus;
    if (["ground_premium", "init", "incomplete"].includes(kycJourneyStatus)) {
      premiumDialogData = premiumBottomSheetMapper[premiumOnboardingStatus];
      premiumDialogData.status = premiumOnboardingStatus;
    }

    if (
      ["submitted", "complete"].includes(kycJourneyStatus) &&
      !isMfInvested &&
      kyc.bank.meta_data_status === "approved"
    ) {
      premiumDialogData = kycStatusMapper["mf_complete"];
      premiumDialogData.icon = `${productName}/${premiumDialogData.icon}`;
    }

    if (premiumOnboardingStatus && !isEmpty(premiumDialogData)) {
      if (code === "moneycontrol") {
        return {};
      } else {
        return {
          premiumDialogData,
          showPremiumOnboarding: true,
        };
      }
    }
  } else if (!appStorage.isKycBottomsheetDisplayed) {
    let modalData = {};
    const kycStatusesToShowDialog = [
      "verifying_trading_account",
      "complete",
      "fno_rejected",
      "esign_pending",
    ];
    if (kycStatusesToShowDialog.includes(kycJourneyStatus)) {
      if (["fno_rejected", "complete"].includes(kycJourneyStatus)) {
        if (
          tradingEnabled &&
          kyc.equity_investment_ready &&
          user.equity_status === "init"
        ) {
          modalData = kycStatusMapper["kyc_verified"];
        } else if (!tradingEnabled && !isCompliant && !isMfInvested) {
          modalData = kycStatusMapper["mf_complete"];
        }
      } else {
        modalData = kycStatusMapper[kycJourneyStatus];
      }
    }

    if (!isEmpty(modalData)) {
      if (!modalData.dualButton) {
        modalData.oneButton = true;
      }
      return {
        showKycBottomsheet: true,
        modalData,
      };
    }
  }
  return {};
};

export function handleCampaignRedirection(url, showRedirectUrl) {
  const config = getConfig();
  let campLink = url;
  let plutusRedirectUrl = `${getBasePath()}/?is_secure=${
    config.isSdk
  }&partner_code=${config.code}`;
  campLink = `${campLink}${
    campLink.match(/[\?]/g) ? "&" : "?"
  }generic_callback=true&${
    showRedirectUrl ? "redirect_url" : "plutus_redirect_url"
  }=${encodeURIComponent(plutusRedirectUrl)}&campaign_version=1`;
  window.location.href = campLink;
}

export const handleCampaign =
  ({ campaignData, handleLoader, handleBottomsheets, sendEvents }) =>
  () => {
    if (isFunction(sendEvents)) {
      sendEvents("next", {
        intent: campaignData.title,
      });
    }
    const campLink = campaignData.url;
    if (isEmpty(campLink)) {
      closeCampaignDialog({ campaignData, handleBottomsheets })();
      return;
    }
    if (campaignData.campaign_name === "insurance_o2o_campaign") {
      hitCampaignFeedbackUrl(
        Api,
        campaignData.action_buttons?.buttons[0]?.feedback_url
      );
      return;
    }
    handleBottomsheets({ [BOTTOMSHEET_KEYS.openCampaign]: false });
    handleLoader({ skelton: true });
    const showRedirectUrl = campaignData.campaign_name === "whatsapp_consent";
    handleCampaignRedirection(campLink, showRedirectUrl);
  };

export const closeCampaignDialog =
  ({ campaignData, handleBottomsheets, sendEvents }) =>
  () => {
    if (isFunction(sendEvents)) {
      sendEvents("back", {
        intent: campaignData.title,
        outsideClick: true,
      });
    }
    const campaignsToHitFeedback = [
      "insurance_o2o_campaign",
      "trading_restriction_campaign",
    ];
    if (campaignsToHitFeedback.includes(campaignData.campaign_name)) {
      hitCampaignFeedbackUrl(
        Api,
        campaignData.action_buttons?.buttons[0]?.feedback_url
      );
    }
    handleBottomsheets({ [BOTTOMSHEET_KEYS.openCampaign]: false });
  };
