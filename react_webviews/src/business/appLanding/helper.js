import {
  INVESTMENT_OPTIONS,
  WEBAPP_LANDING_PATHNAME_MAPPER,
} from "../../constants/webappLanding";
import { getConfig, isTradingEnabled } from "../../utils/functions";
import { getPartnerData } from "../../utils/partner";
import { storageService } from "../../utils/validators";
import { isEmpty } from "lodash-es";
import { nativeCallback } from "../../utils/native_callback";

export const getInvestCardsData = (
  investSections = [],
  signifier,
  fallbackOptions
) => {
  const config = getConfig();
  let isMfOnly = false;
  let data = getEnabledFeaturesData(config, investSections, signifier);
  if (data.cardsData.length === 1) {
    data = getEnabledFeaturesData(config, fallbackOptions, signifier);
    isMfOnly = true;
  }
  let { cardsData, signifierIndex } = data;
  if (signifierIndex !== -1) {
    const selectedCardData = cardsData.find((el) => el.id === signifier);
    cardsData = cardsData.filter((el) => el.id !== signifier);
    cardsData.unshift(selectedCardData);
  }
  return { investCardsData: cardsData, isMfOnly };
};

export const getEnabledFeaturesData = (config, investOptions, signifier) => {
  const { productName, features = {} } = config;
  const restrictedItems = [
    "stocks",
    "ipo",
    "nps",
    "insurance",
    "instaredeem",
    "taxFiling",
  ];
  const referralData = storageService().getObject("referral") || {};
  let subbrokerCode = "";
  let subbrokerFeatures = {};
  if (referralData?.subbroker?.data) {
    subbrokerCode = referralData.subbroker.data.subbroker_code;
    const subbrokerData = getPartnerData(productName, subbrokerCode);
    subbrokerFeatures = subbrokerData.features || {};
  }

  let cardsData = [],
    signifierIndex = -1;

  investOptions.forEach((section, index) => {
    if (
      restrictedItems.includes(section) &&
      ((subbrokerCode && !subbrokerFeatures[section]) || !features[section])
    ) {
      return;
    } else if (["stocks", "ipo"].includes(section) && !isTradingEnabled()) {
      return;
    } else {
      if (signifier === section) {
        signifierIndex = index;
      }
      const cardData = INVESTMENT_OPTIONS[section];
      if (!isEmpty(cardData)) {
        cardsData.push(cardData);
      }
    }
  });
  return { cardsData, signifierIndex };
};

export const getEnabledMarketingBanners = (banners) => {
  return banners.filter(
    (data) =>
      dateValidation(data.endDate, data.startDate) && validateFeature(data.id)
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

export const validateFeature = (type) => {
  if (type === "ipo") {
    return isTradingEnabled();
  }
  return true;
};

export const handleMarketingBanners = (data, sendEvents, navigate) => {
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
  const path = WEBAPP_LANDING_PATHNAME_MAPPER[data.id] || "/";
  navigate(path);
};
