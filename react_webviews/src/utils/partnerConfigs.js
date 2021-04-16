/*
Exhaustive list of property values:
- investSections: [
    'kyc',
    'ourRecommendations',
    'diy',
    'bottomScrollCards',
    'bottomCards',
    'financialTools'
  ]

- features list to use within investSubSectionMap 
    "instaredeem",
    "buildwealth",
    "savetax",
    "parkmoney",
    "savegoal"
    "nfo", (mostly used for 'bottomCards' key)
    "diyv2" (only used for 'diy' key)
    "fhc", "risk_profiler" (only used for 'financialTools' key)

*/

export const commonCardsConfig = {
  investSections: [
    'kyc',
    'ourRecommendations',
    'diy',
    'bottomScrollCards',
    'bottomCards',
  ],
  investSubSectionMap: {
    ourRecommendations: [
      "instaredeem",
      "buildwealth",
      "savetax",
    ],
    diy: ["diyv2"],
    bottomScrollCards: ["parkmoney", "savegoal"],
    bottomCards: ["nfo"],
  },
  riskEnabledFunnels: false,
};

export const basePartnerConfig = {
fisdom: {
  productName: 'fisdom',
  email: 'ask@fisdom.com',
  mobile: '+91-7829228886',
  appLink: 'https://fisdom.onelink.me/CQFA/3e75c8f6',
  termsLink: 'https://www.fisdom.com/terms/',
  schemeLink: 'https://www.fisdom.com/scheme-offer-documents/',
  webAppUrl: 'https://app.fisdom.com/#!/',
  emailDomain: 'fisdom.com',
  riskEnabledFunnels: false,
},
finity: {
  productName: 'finity',
  email: 'ask@finity.in',
  mobile: '+91-8048039999',
  appLink: 'https://myway.onelink.me/W4GN/1f539fd2',
  termsLink: 'https://finity.in/terms/',
  schemeLink: 'https://finity.in/scheme/',
  webAppUrl: 'https://app.mywaywealth.com/#!/',
  emailDomain: 'finity.in',
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
}
};

export const baseStylingConfig = {
common: {
  /* Can consider using a common style object for styles
  common to both partner types*/
},
fisdom: {
  default: '#4a4a4a',
  primaryColor: '#4f2da7',
  secondaryColor: '#35cb5d',
  highlightColor: '#f6f2ff',
  skeletonColor: '#E7E7E7',
  // backButtonColor: '#2E3192',
},
finity: {
  default: '#4a4a4a',
  primaryColor: '#3792fc',
  secondaryColor: '#35cb5d',
  highlightColor: '#F0F7FF',
  skeletonColor: '#E7E7E7',
  // backButtonColor: '#2E3192',
}
};

export const baseUIElementsConfig = {
formLabel: {
  color: '#a2a2a2',
}
};

export const partnerConfigs = {
obc: {
  logo: 'obc.png',
  code: 'obc',
  email: 'obc@fisdom.com',
  mobile: '+91-7829228887',
  banner: 'obc_banner.png',
  styling: {
    primaryColor: '#4DB848'
  },
},
fisdom: {
  investSections: [
    ...commonCardsConfig.investSections,
    'financialTools',
  ],
  investSubSectionMap: {
    ourRecommendations: [
      "instaredeem",
      "insurance",
      "buildwealth",
      "savetax",
      "nps",
    ],
    diy: ["diyv2", "gold"],
    bottomScrollCards: ["parkmoney", "savegoal"],
    bottomCards: ["nfo"],
    financialTools: ["fhc", "risk_profile"],
  },
},
bfdlmobile: {
  logo: 'bfdl_white_sdk_logo.svg',
  code: 'bfdlmobile',
  email: 'bajajfinserv@finity.in',
  mobile: '+91-7829331118',
  banner: 'bfdl_banner.png',
  // back_button: 'back_icon_white.png',
  // close_button: 'close_nav_icon.svg',
  // search_button: 'bfdlmobile_search.png',
  investSections: [
    ...commonCardsConfig.investSections,
    'financialTools',
  ],
  investSubSectionMap: {
    ...commonCardsConfig.investSubSectionMap,
    ourRecommendations: [
      '100_sip',
      'instaredeem',
      'buildwealth',
      'savetax',
    ],
    financialTools: ["risk_profile"]
  },
  landingMarketingBanners: [
    { image: 'nfo.svg', type: 'nfo' },
    { image: 'mb_4.svg', type: '100_sip' },
    { image: 'mb_6.svg', type: 'diy' },
    { image: 'mb_5.svg', type: 'buildwealth' },
  ],
  referralConfig: {
    applyRefferal: false, // same as hide_apply_referral but with opposite value
    shareRefferal: false, // same as hide_share_referral but with opposite value
  },
  styling: {
    primaryColor: '#4DB848',
    secondaryColor: '#ff5928',
  },
  uiElements: {
    bottomCta: {
      disabledBackgroundColor: '#ffffff', // same as 'cta_disabled_background'
    }
  }
},
fpg: {
  logo: 'text_investments.svg',
  code: 'fpg',
  mobile: '1800-212-5997',
  email: 'care.futuremoney@fisdom.com',
  banner: 'bfdl_banner.png',
  investSections: [
    ...commonCardsConfig.investSections,
    'financialTools',
  ],
  investSubSectionMap: {
    ...commonCardsConfig.investSubSectionMap,
    ourRecommendations: [
      'instaredeem',
      'buildwealth',
      'gold',
      'savetax',
    ],
    popularCards: [
      'top_equity',
      'nps'
    ],
  },
  landingMarketingBanners: [
    { image: 'Gold_updated_banner.svg', type: 'gold' },
    { image: 'fpg_mb_insta.svg', type: 'instaredeem' },
    { image: 'fpg_mb_100.svg', type: 'buildwealth' },
  ],
  referralConfig: {
    applyRefferal: false, // same as hide_apply_referral but with opposite value
    shareRefferal: false, // same as hide_share_referral but with opposite value
  },
  styling: {
    primaryColor: '#EB6024',
    secondaryColor: '#EB6024',
  },
  uiElements: {
    bottomCta: {
      disabledBackgroundColor: '#F1D5C9', // same as 'cta_disabled_background'
      disabledColor: '#ffffff' // same as cta_disabled_color
    }
  }
}
};
