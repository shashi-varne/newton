/*
Exhaustive list of property values:
- investSections: [
    'kyc',
    'stocks',
    'ourRecommendations',
    'diy',
    'bottomScrollCards',
    'bottomCards',
    'financialTools',
    'popularCards',
  ]

- features list to use within investSubSectionMap 
    "instaredeem",
    "buildwealth",
    "insurance",
    "savetax",
    "nps",
    "parkmoney", (used under 'bottomScrollCards' key)
    "savegoal", (used under 'bottomScrollCards' key)
    "nfo", (mostly used under 'bottomCards' key)
    "diyv2", (only used under 'diy' key)
    "gold", (used under 'diy' key)
    "fhc", "risk_profile" (only used under 'financialTools' key)
*/

import {
  EQUITY_ONBOARDING_CAROUSELS,
  EQUITY_PLATFORM_MOTIVATORS,
  ONBOARDING_CAROUSELS,
  PLATFORM_MOTIVATORS,
} from "./partnerConstants";

// common config across all partners
export const commonCardsConfig = {
  investSections: ["stocks", "ipo", "mf", "nps", "insurance", "taxFiling"],
  mfOptions: ["buildwealth", "nfo", "parkmoney", "viewAll"],
  investingOptions: [
    "buildwealth",
    "nfo",
    "parkmoney",
    "elss",
    "savegoal",
    "instaredeem",
  ],
  landingMarketingBanners: [
    {
      image: "freedomplan.svg",
      id: "freedomplan",
      eventStatus: "introducing freedom plan",
    },
    {
      image: "freedomplan.svg",
      id: "elss",
    },
  ],
  nfoBanners: [],
};

export const basePartnerConfig = {
  common: {
    onboardingCarousels: ONBOARDING_CAROUSELS,
    platformMotivators: PLATFORM_MOTIVATORS,
  },
  fisdom: {
    productName: "fisdom",
    logo: "fisdom/fisdom_logo.svg",
    colorLogo: "fisdom/fisdom_logo.svg",
    email: "ask@fisdom.com",
    mobile: "+91-9642596425",
    websiteLink: "https://www.fisdom.com",
    appLink: "https://fisdom.onelink.me/CQFA/3e75c8f6",
    termsLink: "https://www.fisdom.com/terms/",
    schemeLink: "https://www.fisdom.com/scheme-offer-documents/",
    privacyLink: "https://www.fisdom.com/privacy/",
    refundLink: "https://www.fisdom.com/refund/",
    disclaimerLink: "https://www.fisdom.com/disclaimer/",
    webAppUrl: "https://app.fisdom.com/#!/",
    equityAnnexure: "https://fisdom.com/images/forms/Equity%20Annexures.pdf",
    configPrimaryColorClass: "configPrimaryColorClass",
    configPrimaryBackgroundColorClass: "fisdomBackColor",
    emailDomain: "fisdom.com",
    riskEnabledFunnels: false,
    referralConfig: {
      applyRefferal: true, // same as hide_apply_referral but with opposite value
      shareRefferal: false, // same as hide_share_referral but with opposite value
    },
  },
  finity: {
    productName: "finity",
    logo: "finity/finity_logo.svg",
    colorLogo: "finity/finity_logo.svg",
    email: "ask@finity.in",
    mobile: "+91-8142381423",
    websiteLink: "https://www.finity.in",
    appLink: "https://myway.onelink.me/W4GN/1f539fd2",
    termsLink: "https://finity.in/terms/",
    schemeLink: "https://finity.in/scheme/",
    privacyLink: "https://www.finity.in/privacy/",
    refundLink: "https://www.finity.in/refund/",
    disclaimerLink: "https://www.finity.in/disclaimer/",
    webAppUrl: "https://app.mywaywealth.com/#!/",
    equityAnnexure:
      "https://fisdom.com/images/forms/Equity_Annexures_Finity.pdf",
    configPrimaryColorClass: "configPrimaryColorClass",
    configPrimaryBackgroundColorClass: "fisdomBackColor",
    emailDomain: "finity.in",
    message: "",
    riskEnabledFunnels: true,
    referralConfig: {
      applyRefferal: false,
      shareRefferal: false,
    },
  },
};

export const baseTypographyConfig = {
  common: {
    // fontFamily: '',
    // fontSize: '',
    // lineHeight: '',
  },
  fisdom: {
    // fontFamily: '',
    // fontSize: '',
    // lineHeight: '',
  },
  finity: {
    // fontFamily: '',
    // fontSize: '',
    // lineHeight: '',
  },
};

export const baseStylesConfig = {
  common: {
    /* Can consider using a common style object for styles
      common to both partner types*/
    default: "#4a4a4a",
    skeletonColor: "#E7E7E7",
    notificationsColor: "#ffffff",
  },
  fisdom: {
    primaryColor: "#4f2da7",
    secondaryColor: "#35cb5d",
    highlightColor: "#f6f2ff",
    secondaryGreen: "#7ED321",
    primaryVariant1: "#DFD8EF",
    primaryVariant2: "#A998D2",
    primaryVariant4: "#482998",
    primaryVariant5: "#24154C",
    darkBackground: "#24154C",
  },
  finity: {
    default: "#4a4a4a",
    primaryColor: "#675AF6",
    secondaryColor: "#675AF6",
    highlightColor: "#EFEEFB",
    secondaryGreen: "#33CF90",
    primaryVariant1: "#C6C2F9",
    primaryVariant2: "#B9B3F9",
    primaryVariant4: "#482998",
    primaryVariant5: "#4F44D0",
    darkBackground: "#132056",
  },
};

export const baseButtonConfig = {
  common: {
    borderRadius: 4,
    disabledColor: "#FFFFFF",
  },
  fisdom: {
    disabledBackgroundColor: "#E8ECF1",
    focusBackgroundColor: "#119A4B",
  },
  finity: {
    disabledBackgroundColor: "#E6E5F4",
    focusBackgroundColor: "#4F47BA",
    hoverBackgroundColor: "#4F47BA",
    hoverSecondaryBackgroundColor: "#F5F4FD",
  },
};

export const baseUIElementsConfig = {
  formLabel: {
    color: "#a2a2a2",
  },
};

export const partnerConfigs = {
  obc: {
    logo: "obc.png",
    code: "obc",
    email: "obc@fisdom.com",
    mobile: "+91-7829228887",
    message: getPartnerMessage("OBC m-pay"),
    styles: {
      primaryColor: "#4DB848",
    },
  },
  lvb: {
    logo: "lvb.svg",
    code: "lvb",
    email: "lvb@fisdom.com",
    message: getPartnerMessage("LVB Mobile"),
    styles: {
      primaryColor: "#CC0E00",
    },
  },
  svc: {
    logo: "svc.svg",
    code: "svc",
    email: "svc@fisdom.com",
    styles: {
      primaryColor: "#213B68",
    },
  },
  fisdom: {
    code: "fisdom",
    features: {
      taxFiling: true,
      addAnotherBank: true,
      stocks: true,
      ipo: true,
      nps: true,
      instaredeem: true,
    },
    onboardingCarousels: EQUITY_ONBOARDING_CAROUSELS,
    platformMotivators: EQUITY_PLATFORM_MOTIVATORS,
  },
  finity: {
    code: "finity",
    mobile: "+91-9916149111",
    features: {
      taxFiling: true,
      addAnotherBank: true,
      instaredeem: true,
      indexFunds: true,
    },
  },
  bfdlmobile: {
    logo: "bfdl_white_sdk_logo.svg",
    code: "bfdlmobile",
    email: "bajajfinserv@finity.in",
    mobile: "+91-7829331118",
    landingMarketingBanners: [
      ...commonCardsConfig.landingMarketingBanners,
      ...commonCardsConfig.nfoBanners,
      { image: "mb_6.svg", type: "diy" },
      { image: "mb_5.svg", type: "buildwealth" },
    ],
    referralConfig: {
      applyRefferal: false, // same as hide_apply_referral but with opposite value
      shareRefferal: false, // same as hide_share_referral but with opposite value
    },
    styles: {
      primaryColor: "#004164",
      secondaryColor: "#ff5928",
    },
    uiElements: {
      button: {
        hoverBackgroundColor: "#ff5928",
      },
    },
  },
  alb: {
    logo: "alb.png",
    code: "alb",
    email: "alb@fisdom.com",
    message: getPartnerMessage("emPower", "emPower http://onelink.to/uuxsss"),
    mobile: "+91-7829733111",
    features: {
      stocks: true,
      ipo: true,
      nps: true,
    },
    styles: {
      primaryColor: "#2E3192",
      secondaryColor: "#00aeef",
      backButtonColor: "#2E3192",
      notificationsColor: "#00aeef",
    },
    uiElements: {
      title: {
        color: "#2E3192",
      },
      header: {
        backgroundColor: "#E8FD00",
      },
    },
  },
  tvscredit: {
    logo: "tvs.svg",
    code: "tvscredit",
    email: "tvscredit@fisdom.com",
    message: getPartnerMessage("Tvs Credit"),
    features: {
      instaredeem: true,
    },
    styles: {
      primaryColor: "#2d2851",
    },
  },
  ktb: {
    code: "ktb",
    email: "kbl@fisdom.com",
    mobile: "+91-7829229997",
    styles: {
      primaryColor: "#8C0094",
    },
    referralConfig: {
      applyRefferal: true,
      shareRefferal: false,
    },
  },
  cub: {
    logo: "cub.svg",
    code: "cub",
    email: "cub@fisdom.com",
    features: {
      taxFiling: true,
      nps: true,
    },
    styles: {
      primaryColor: "#000180",
    },
  },
  fpg: {
    logo: "fpg.svg",
    code: "fpg",
    mobile: "1800-212-5997",
    email: "care.futuremoney@fisdom.com",
    landingMarketingBanners: [
      ...commonCardsConfig.landingMarketingBanners,
      ...commonCardsConfig.nfoBanners,
      { image: "fpg_mb_insta.svg", type: "instaredeem" },
      { image: "fpg_mb_100.svg", type: "buildwealth" },
    ],
    features: {
      nps: true,
      instaredeem: true,
    },
    referralConfig: {
      applyRefferal: false, // same as hide_apply_referral but with opposite value
      shareRefferal: false, // same as hide_share_referral but with opposite value
    },
    landingConfig: {
      nps: "inside_sdk",
    },
    styles: {
      primaryColor: "#EB6024",
      secondaryColor: "#EB6024",
    },
    uiElements: {
      button: {
        borderRadius: 25,
        disabledBackgroundColor: "#F1D5C9", // same as 'cta_disabled_background'
      },
    },
  },
  hbl: {
    logo: "hbl.svg",
    logoWidth: "200px",
    code: "hbl",
    features: {
      nps: true,
    },
    styles: {
      primaryColor: "#0066B3",
    },
  },
  subh: {
    logo: "subh.svg",
    code: "subh",
    email: "support@shubhloans.com",
    mobile: "+91-9019900199",
    styles: {
      primaryColor: "#F5821F",
      secondaryColor: "#F5821F",
    },
  },
  sbm: {
    logo: "sbm.svg",
    code: "sbm",
    email: "sbm@fisdom.com",
    styles: {
      primaryColor: "#1e3769",
    },
  },
  flexi: {
    code: "flexi",
    features: {
      nps: true,
    },
  },
  medlife: {
    code: "medlife",
    features: {
      nps: true,
    },
  },
  life99: {
    code: "life99",
  },
  indb: {
    code: "indb",
    mobile: "+80-48-093070",
    onboardingCarousels: EQUITY_ONBOARDING_CAROUSELS,
    platformMotivators: EQUITY_PLATFORM_MOTIVATORS,
    features: {
      stocks: true,
      ipo: true,
      nps: true,
    },
    referralConfig: {
      applyRefferal: true,
      shareRefferal: true, // same as hide_share_referral but with opposite value
    },
    styles: {
      primaryColor: "#173883",
      secondaryColor: "#173883",
    },
  },
  finshell: {
    logo: "finshell.svg",
    code: "finshell",
    email: "finshellpay@fisdom.com",
    mobile: "+80-48-093070",
    features: {
      nps: true,
    },
    styles: {
      primaryColor: "#007AFF",
      secondaryColor: "#007AFF",
    },
  },
  ippb: {
    code: "ippb",
    styles: {
      primaryColor: "#3F1027",
    },
  },
  moneycontrol: {
    logo: "moneycontrol_logo.svg",
    code: "moneycontrol",
    email: "moneycontrol@finity.in",
  },
  taxwin: {
    code: "taxwin",
    logo: "taxwin.svg",
    logoWidth: "200px",
    features: {
      nps: true,
    },
  },
  google: {
    code: "google",
    mobile: "+80-48-093070",
  },
  quesscorp: {
    logo: "quesscorp.svg",
    logoWidth: "200px",
    code: "quesscorp",
  },
  sahaj: {
    code: "sahaj",
    features: {
      nps: true,
    },
    styles: {
      primaryColor: "#e5322d",
    },
  },
  mspl: {
    code: "mspl",
    styles: {
      primaryColor: "#252B69",
    },
    features: {
      nps: true,
    },
  },
  ucomb: {
    code: "ucomb",
    logo: "ucomb.svg",
    webLogo: "ucomb_bank.svg",
    logoWidth: "200px",
    onboardingCarousels: EQUITY_ONBOARDING_CAROUSELS,
    platformMotivators: EQUITY_PLATFORM_MOTIVATORS,
    styles: {
      primaryColor: "#002759",
      secondaryColor: "#002759",
      backButtonColor: "#002759",
      notificationsColor: "#002759",
    },
    uiElements: {
      header: {
        backgroundColor: "#FFF500",
      },
    },
    features: {
      addAnotherBank: true,
      taxFiling: true,
      stocks: true,
      ipo: true,
      nps: true,
    },
    referralConfig: {
      applyRefferal: true,
      shareRefferal: true,
    },
  },
  bom: {
    code: "bom",
    logo: "bom.svg",
    styles: {
      primaryColor: "#378ECF",
    },
    referralConfig: {
      applyRefferal: true,
      shareRefferal: false,
    },
  },
  sbnri: {
    code: "sbnri",
    logo: "sbnri.svg",
    styles: {
      primaryColor: "#3E89FA",
    },
  },
  tmb: {
    code: "tmb",
    logo: "tmb.png",
    styles: {
      primaryColor: "#2D4191",
      secondaryColor: "#2D4191",
      backButtonColor: "#2D4191",
      notificationsColor: "#2D4191",
    },
    uiElements: {
      header: {
        backgroundColor: "#FFFFFF",
      },
    },
  },
  cccb: {
    code: "cccb",
  },
  sury: {
    code: "sury",
  },
  svcho: {
    code: "svcho",
  },
  apna: {
    code: "apna",
    features: {
      nps: true,
    },
  },
};

export const getPartnerData = (productType, partnerCode) => {
  // Appending base config of the productType(fisdom/finity) with the common config accross all partners
  let partnerConfigToReturn = {
    ...commonCardsConfig,
    ...basePartnerConfig["common"],
    ...basePartnerConfig[productType],
  };
  const partnerData =
    partnerConfigs[partnerCode] ||
    partnerConfigs[productType] ||
    partnerConfigs["fisdom"];
  partnerConfigToReturn = {
    message: getPartnerMessage(partnerData.code.toUpperCase()),
    ...partnerConfigToReturn, // taking the base config of the productType(fisdom/finity)
    ...partnerData, // overriding with particular partner config
    styles: {
      ...baseStylesConfig.common,
      ...baseStylesConfig[productType], //taking common base styles config
      ...partnerData?.styles, // overriding with the partner styles
    },
    uiElements: {
      formLabel: {
        ...baseUIElementsConfig.formLabel,
        ...partnerData.uiElements?.formLabel,
      },
      header: {
        ...partnerData.uiElements?.header,
      },
      title: {
        ...partnerData.uiElements?.title,
      },
      button: {
        ...baseButtonConfig.common,
        ...baseButtonConfig[productType],
        ...partnerData.uiElements?.button,
      },
    },
    typography: {
      ...baseTypographyConfig[productType],
      ...partnerData?.typography,
    },
  };
  return partnerConfigToReturn;
};

export function getPartnerMessage(
  partnerApp,
  appLink = "fisdom http:m.onelink.me/32660e84"
) {
  return `Make smart investments with zero paper work, use ${partnerApp} app if you're a registered user on ${partnerApp} app or download ${appLink}. Use my referral code `;
}
