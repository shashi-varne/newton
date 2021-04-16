export const basePartnerConfig = {
  common: {
    // INVEST SCREEN specific -----------------
    investSections: [
      'kyc',
      'ourRecommendations',
      'diy',
      'popularCards',
      'bottomScrollCards',
      'bottomCards',
      'financialTools',
    ],
    investSubSectionMap: {
      kyc: [],
      ourRecommendations: [
        '100_sip',
        '300_sip',
        'instaredeem',
        'buildwealth',
        'savetax',
        'instaredeem',
        'gold',
        'loan'
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
      financialTools: [
        'fhc',
        'risk_profiler'
      ]
    },
    // INVEST SCREEN specific END --------------
    // SDK LANDING SCREEN specific ----------
    landingMarketingBanners: [
      { image: 'mb_4.svg', type: '100_sip' },
      { image: 'mb_6.svg', type: 'diy' },
      { image: 'mb_5.svg', type: 'buildwealth' },
    ],
    landingConfig: { // same as 'entry' prop in old config
      nps: 'inside_sdk',
    },
    // SDK LANDING SCREEN specific END ------
    referralConfig: { // same as feature_manager in old config 
      applyRefferal: true,
      shareRefferal: true,
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
    email: 'ask@fisdom.com',
    mobile: '+91-8048039999',
    appLink: 'https://myway.onelink.me/W4GN/1f539fd2',
    termsLink: 'https://finity.in/terms/',
    schemeLink: 'https://finity.in/scheme/',
    askEmail: 'ask@finity.in',
    webAppUrl: 'https://app.mywaywealth.com/#!/',
    email_domain: 'finity.in',
    riskEnabledFunnels: true,
  },
};

export const baseTypographyConfig = {
  fisdom: {
    // fontFamily: '',
    // fontSize: '',
    // lineHeight: '',
    titleProps: {
      // fontFamily: '',
      // fontSize: '',
      color: '#2E3192',
    },
    ctaProps: {
      disabledColor: '#ffffff',
      // color: '',
    },
    formLabelProps: {
      color: '#a2a2a2',
    }
  },
  finity: {
    // fontFamily: '',
    // fontSize: '',
    // lineHeight: '',
    titleProps: {
      // fontFamily: '',
      // fontSize: '',
      color: '#2E3192',
    },
    ctaProps: {
      disabledColor: '#ffffff',
      // color: '',
    },
    formLabelProps: {
      color: '#a2a2a2',
    }
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
    // header: {
    //   background: '#FFF',
    // },
    // ctaProps: {
    //   backgroundDisabled: '#F1D5C9',
    //   borderRadius: '',
    // },
  },
  finity: {
    default: '#4a4a4a',
    primaryColor: '#3792fc',
    secondaryColor: '#35cb5d',
    highlightColor: '#F0F7FF',
    skeletonColor: '#E7E7E7',
    // backButtonColor: '#2E3192',
    // header: {
    //   background: '#FFF',
    // },
    // ctaProps: {
    //   backgroundDisabled: '#F1D5C9',
    //   borderRadius: '',
    // },
  }
}

export const obc = {
  logo: 'obc.png',
  code: 'obc',
  email: 'obc@fisdom.com',
  mobile: '+91-7829228887',
  banner: 'obc_banner.png',
  styling: {
    primaryColor: '#4DB848'
  }
};

export const bfdlmobile = {
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
  styling: {
    primaryColor: '#4DB848',
    secondaryColor: '#ff5928',
    ctaProps: {
      backgroundDisabled: '#ffffff', // same as 'cta_disabled_background'
    }
  }
};

export const fpg = {
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
  typography: {
    ctaProps: {
      disabledColor: '#ffffff' // same as cta_disabled_color
    }
  },
  styling: {
    primaryColor: '#EB6024',
    secondaryColor: '#EB6024',
    ctaProps: {
      backgroundDisabled: '#F1D5C9', // same as 'cta_disabled_background'
    }
  }
};
