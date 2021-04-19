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

export const basePartnerConfig = {
  common: {
    logo: 'logo_white.png',
    banner: "obc_banner.png",
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
    landingConfig: { // same as 'entry' prop in old config
      nps: 'inside_sdk',
    },
    riskEnabledFunnels: false,
  },
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
    email_domain: 'finity.in',
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

export const baseStylesConfig = {
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
  // Confirm config for fisdom, finity, hbl, flexi, medlife
  fisdom: {
    code: 'fisdom',
    investSections: [
      'kyc',
      'ourRecommendations',
      'diy',
      'bottomScrollCards',
      'bottomCards',
      'financialTools'
    ],
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "savetax",
        "insurance",
        "gold",
        "nps"
      ],
      diy: ["diyv2"],
      bottomScrollCards: ["parkmoney", "savegoal"],
      bottomCards: ["nfo"],
      financialTools: ["fhc", "risk_profiler"]
    },
  },
  finity: {
    logo: 'finity_white_logo.png',
    code: 'finity',
    mobile: '+91-9916149111',
    banner: 'obc_banner.png',
    investSections: [
      'kyc',
      'ourRecommendations',
      'diy',
      'bottomScrollCards',
      'bottomCards',
      'financialTools'
    ],
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "savetax",
        "insurance",
        "gold",
        "nps"
      ],
      diy: ["diyv2"],
      bottomScrollCards: ["parkmoney", "savegoal"],
      bottomCards: ["nfo"],
      financialTools: ["fhc", "risk_profiler"]
    },
  },
  obc: {
    logo: 'obc.png',
    code: 'obc',
    email: 'obc@fisdom.com',
    mobile: '+91-7829228887',
    styles: {
      primaryColor: '#4DB848'
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
      'kyc', // not sure if this is applicable to all?
      'ourRecommendations',
      'financialTools',
    ],
    investSubSectionMap: {
      kyc: [],
      ourRecommendations: [
        '100_sip',
        'instaredeem',
        'buildwealth',
        'savetax',
      ],
      financialTools: ['risk_profiler']
    },
    landingMarketingBanners: [
      { image: 'mb_4.svg', type: '100_sip' },
      { image: 'mb_6.svg', type: 'diy' },
      { image: 'mb_5.svg', type: 'buildwealth' },
    ],
    referralConfig: {
      applyRefferal: false, // same as hide_apply_referral but with opposite value
      shareRefferal: false, // same as hide_share_referral but with opposite value
    },
    styles: {
      primaryColor: '#004164',
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
      'kyc',
      'our_recommendations',
      'popular_cards',
      'diy',
      'bottom_scroll_cards',
      'bottom_cards',
      'financial_tools',
    ],
    investSubSectionMap: {
      ourRecommendations: [
        'instaredeem',
        'buildwealth',
        'gold',
        'savetax',
      ],
      diy: ['diyv2'],
      bottomScrollCards: [
        'parkmoney',
        'savegoal'
      ],
      bottomCards: ['nfo'],
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
    landingConfig: {
      nps: 'inside_sdk',
    },
    styles: {
      primaryColor: '#EB6024',
      secondaryColor: '#EB6024',
    },
    uiElements: {
      bottomCta: {
        disabledBackgroundColor: '#F1D5C9', // same as 'cta_disabled_background'
        disabledColor: '#ffffff' // same as cta_disabled_color
      }
    }
  },
  lvb: {
    logo: 'lvb.png',
    code: 'lvb',
    email: 'lvb@fisdom.com',
    styles: {
      primaryColor: '#CC0E00',
    },
  },
  svc: {
    logo: 'svc.png',
    code: 'svc',
    email: 'svc@fisdom.com',
    styles: {
      primaryColor: '#213B68',
    },
  },
  alb: {
    logo: 'alb.png',
    code: 'alb',
    email: 'alb@fisdom.com',
    mobile: '+91-7829733111',
    banner: 'alb_banner.png',
    styles: {
      primaryColor: '#2E3192',
      secondaryColor: '#00aeef',
      backButtonColor: '#2E3192',
      notificationsColor: '#00aeef',
    },
    uiElements: {
      title: {
        color: '#2E3192',
      }
    }
  },
  tvscredit: {
    logo: 'tvs.png',
    code: 'tvscredit',
    email: 'tvscredit@fisdom.com',
    banner: 'tvs_banner.png',
    investSubSectionMap: {
      ourRecommendations: [
        '100_sip',
        'instaredeem',
        'buildwealth',
        'savetax'
      ],
    },
    styles: {
      primaryColor: '#2d2851',
    },
  },
  ktb: {
    code: 'ktb',
    email: 'kbl@fisdom.com',
    mobile: '+91-7829229997',
    styles: {
      primaryColor: '#8C0094',
    },
    referralConfig: {
      shareRefferal: false,
    },
  },
  cub: {
    logo: 'cub.png',
    code: 'cub',
    email: 'cub@fisdom.com',
    banner: 'bfdl_banner.png',
    styles: {
      primaryColor: '#000180',
    }
  },
  hbl: {
    logo: 'hbl.png',
    code: 'hbl',
    banner: 'bfdl_banner.png',
    // TODO: Verify this part of config, unsure of config values
    investSections: [
      'kyc',
      'ourRecommendations',
      'diy',
      'bottomScrollCards',
      'financialTools'
    ],
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "savetax",
        "nps",
        "gold",
        "insurance"
      ],
      diy: ["diyv2"],
      bottomScrollCards: ["parkmoney", "savegoal"],
      financialTools: ['risk_profiler']
    },
    styles: {
      primaryColor: '#0066B3',
    },
  },
  subh: {
    logo: 'subh.svg',
    code: 'subh',
    email: 'support@shubhloans.com',
    mobile: '+91-9019900199',
    banner: 'bfdl_banner.png',
    investSections: [
      'kyc',
      'our_recommendations',
      'diy'
    ],
    investSubSectionMap: {
      ourRecommendations: [
        '100_sip',
        '300_sip',
        'instaredeem'
      ],
      diy: ['diyv2'],
    },
    styles: {
      primaryColor: '#F5821F',
      secondaryColor: '#F5821F',
    },
    uiElements: {
      bottomCta: {
        disabledColor: '#ffffff',
      }
    }
  },
  sbm: {
    logo: 'sbm.svg',
    code: 'sbm',
    email: 'sbm@fisdom.com',
    banner: 'bfdl_banner.png',
    styles: {
      primaryColor: '#1e3769',
    }
  },
  flexi: {
    code: 'flexi',
    // TODO: Verify this part of config, unsure of config values
    investSections: [
      'kyc',
      'ourRecommendations',
      'diy',
      'bottomScrollCards',
      'financialTools'
    ],
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "savetax",
        "nps",
        "gold",
        "insurance"
      ],
      diy: ["diyv2"],
      bottomScrollCards: ["parkmoney", "savegoal"],
      financialTools: ['risk_profiler']
    },
  },
  medlife: {
    code: 'medlife',
    // TODO: Verify this part of config, unsure of config values
    investSections: [
      'kyc',
      'ourRecommendations',
      'diy',
      'bottomScrollCards',
      'financialTools'
    ],
    investSubSectionMap: {
      ourRecommendations: [
        "instaredeem",
        "buildwealth",
        "savetax",
        "nps",
        "gold",
        "insurance"
      ],
      diy: ["diyv2"],
      bottomScrollCards: ["parkmoney", "savegoal"],
      financialTools: ['risk_profiler']
    },
  },
  life99: {
    code: 'life99',
  },
  google: {
    code: 'google',
    mobile: '+80-48-093070',
    uiElements: {
      header: {
        backgroundColor: '#FFF' // same as white_header
      }
    }
  },
  indb: {
    code: 'indb',
    mobile: '+80-48-093070',
    styles: {
      primaryColor: '#173883',
      secondaryColor: '#173883',
    }
  },
  taxwin: {
    code: "taxwin",
  },
};
