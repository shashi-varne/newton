/*
Exhaustive list of property values:
- investSections: [
    'kyc',
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

// common config across all partners
export const commonCardsConfig = {
  logo: "logo_white.png",
  investSections: [
    "kyc",
    "ourRecommendations",
    "diy",
    "bottomScrollCards",
    "bottomCards",
    "financialTools",
    "popularCards",
  ],
  investSubSectionMap: {
    ourRecommendations: ["instaredeem", "buildwealth", "savetax"],
    diy: ["diyv2"],
    bottomScrollCards: ["parkmoney", "savegoal"],
    bottomCards: ["nfo"],
  },
  riskEnabledFunnels: false,
};

export const basePartnerConfig = {
  fisdom: {
    productName: "fisdom",
    email: "ask@fisdom.com",
    mobile: "+91-7829228886",
    appLink: "https://fisdom.onelink.me/CQFA/3e75c8f6",
    termsLink: "https://www.fisdom.com/terms/",
    schemeLink: "https://www.fisdom.com/scheme-offer-documents/",
    webAppUrl: "https://app.fisdom.com/#!/",
    emailDomain: "fisdom.com",
    riskEnabledFunnels: false,
  },
  finity: {
    productName: "finity",
    email: "ask@finity.in",
    mobile: "+91-8048039999",
    appLink: "https://myway.onelink.me/W4GN/1f539fd2",
    termsLink: "https://finity.in/terms/",
    schemeLink: "https://finity.in/scheme/",
    webAppUrl: "https://app.mywaywealth.com/#!/",
    emailDomain: "finity.in",
    riskEnabledFunnels: true,
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
  },
  fisdom: {
    default: "#4a4a4a",
    primaryColor: "#4f2da7",
    secondaryColor: "#35cb5d",
    highlightColor: "#f6f2ff",
    skeletonColor: "#E7E7E7",
    // backButtonColor: '#2E3192',
  },
  finity: {
    default: "#4a4a4a",
    primaryColor: "#3792fc",
    secondaryColor: "#35cb5d",
    highlightColor: "#F0F7FF",
    skeletonColor: "#E7E7E7",
    // backButtonColor: '#2E3192',
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
    styles: {
      primaryColor: "#4DB848",
    },
  },
  lvb: {
    logo: "lvb.png",
    code: "lvb",
    email: "lvb@fisdom.com",
    styles: {
      primaryColor: "#CC0E00",
    },
  },
  svc: {
    logo: "svc.png",
    code: "svc",
    email: "svc@fisdom.com",
    styles: {
      primaryColor: "#213B68",
    },
  },
  fisdom: {
    code: "fisdom",
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "insurance",
        "savetax",
        "nps",
      ],
      diy: ["diyv2", "gold"],
      bottomScrollCards: ["parkmoney", "savegoal"],
      bottomCards: ["nfo"],
      financialTools: ["fhc", "risk_profile"],
    },
  },
  finity: {
    logo: "finity_white_logo.png",
    code: "finity",
    mobile: "+91-9916149111",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: ["instaredeem", "buildwealth", "savetax"],
      financialTools: ["fhc", "risk_profile"],
    },
  },
  bfdlmobile: {
    logo: "bfdl_white_sdk_logo.svg",
    code: "bfdlmobile",
    email: "bajajfinserv@finity.in",
    mobile: "+91-7829331118",
    message: "",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: ["100_sip", "instaredeem", "buildwealth", "savetax"],
      financialTools: ["risk_profile"],
    },
    landingMarketingBanners: [
      { image: "nfo.svg", type: "nfo" },
      { image: "mb_4.svg", type: "100_sip" },
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
      bottomCta: {
        disabledColor: "#ffffff",
      },
    },
  },
  alb: {
    logo: "alb.png",
    code: "alb",
    email: "alb@fisdom.com",
    message: "",
    mobile: "+91-7829733111",
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
        backgroundColor : "#E8FD00",
      }
    },
  },
  tvscredit: {
    logo: "tvs.png",
    code: "tvscredit",
    email: "tvscredit@fisdom.com",
    message: "",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: ["100_sip", "instaredeem", "buildwealth", "savetax"],
    },
    styles: {
      primaryColor: "#2d2851",
    },
  },
  ktb: {
    code: "ktb",
    email: "kbl@fisdom.com",
    message: "",
    mobile: "+91-7829229997",
    styles: {
      primaryColor: "#8C0094",
    },
    referralConfig: {
      shareRefferal: false,
    },
  },
  cub: {
    logo: "cub.png",
    code: "cub",
    email: "cub@fisdom.com",
    message: "",
    styles: {
      primaryColor: "#000180",
    },
  },
  fpg: {
    logo: "text_investments.svg",
    code: "fpg",
    mobile: "1800-212-5997",
    email: "care.futuremoney@fisdom.com",
    message: "",
    investSections: [
      "kyc",
      "ourRecommendations",
      "popularCards",
      "diy",
      "bottomScrollCards",
      "bottomCards",
      "financialTools",
    ],
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: ["instaredeem", "buildwealth", "gold", "savetax"],
      popularCards: ["top_equity", "nps"],
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
      bottomCta: {
        disabledBackgroundColor: "#F1D5C9", // same as 'cta_disabled_background'
        disabledColor: "#ffffff", // same as cta_disabled_color
        borderRadius: 25,
      },
    },
  },
  hbl: {
    logo: "hbl.png",
    code: "hbl",
    message: "",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "insurance",
        "savetax",
        "nps",
      ],
      diy: ["diyv2", "gold"],
      financialTools: ["risk_profile"],
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
    message: "",
    investSections: ["kyc", "ourRecommendations", "diy"],
    investSubSectionMap: {
      ourRecommendations: ["100_sip", "300_sip", "instaredeem"],
      diy: ["diyv2"],
    },
    styles: {
      primaryColor: "#F5821F",
      secondaryColor: "#F5821F",
    },
    uiElements: {
      bottomCta: {
        disabledColor: "#ffffff",
      },
    },
  },
  sbm: {
    logo: "sbm.svg",
    code: "sbm",
    email: "sbm@fisdom.com",
    message: "",
    styles: {
      primaryColor: "#1e3769",
    },
  },
  flexi: {
    code: "flexi",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "insurance",
        "savetax",
        "nps",
      ],
      diy: ["diyv2", "gold"],
      financialTools: ["risk_profile"],
    },
  },
  medlife: {
    code: "medlife",
    message: "",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "insurance",
        "savetax",
        "nps",
      ],
      diy: ["diyv2", "gold"],
      financialTools: ["risk_profile"],
    },
  },
  life99: {
    code: "life99",
    message: "",
  },
  indb: {
    code: "indb",
    mobile: "+80-48-093070",
    message: "",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: ["instaredeem", "buildwealth", "savetax", "nps"],
    },
    referralConfig: {
      shareRefferal: false, // same as hide_share_referral but with opposite value
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
    message: "",
    investSubSectionMap: {
      ...commonCardsConfig.investSubSectionMap,
      ourRecommendations: ["instaredeem", "buildwealth", "savetax", "nps"],
    },
    styles: {
      primaryColor: "#007AFF",
      secondaryColor: "#007AFF",
    },
  },
  ippb: {
    code: "ippb",
    message: "",
    styles: {
      primaryColor: "#3F1027",
    },
  },
  moneycontrol: {
    logo: "moneycontrol.svg",
    code: "moneycontrol",
    email: "moneycontrol@finity.in",
    mobile: "+91-7829228886", // check with satendra -> mobile is of fisdom
    message: "",
    styles: {
      primaryColor: "#3792FC",
      backButtonColor: "#3792FC",
    },
    uiElements: {
      header: {
        backgroundColor: "#FFF", // same as white_header
      },
    },
  },
  taxwin: {
    code: "taxwin",
    logo: "taxwin.png",
    message: "",
    investSections: ["kyc", "ourRecommendations"],
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "insurance",
        "savetax",
        "nps",
      ],
    },
  },
  google: {
    code: "google",
    mobile: "+80-48-093070",
    uiElements: {
      header: {
        backgroundColor: "#FFF", // same as white_header
      },
    },
  },
};
