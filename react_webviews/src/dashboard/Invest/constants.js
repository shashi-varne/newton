import { PATHNAME_MAPPER as KYC_PATHNAME_MAPPER } from "../../kyc/constants";

export const apiConstants = {
  accountSummary: "/api/user/account/summary",
  npsInvestStatus: "/api/nps/invest/status/v2",
  getRecommendation: "/api/invest/recommendv2",
  getInstaRecommendation: "/api/invest/insta-redeem/getfunds",
  getNfoRecommendation: "/api/invest/nfo/recommendations",
  getPurchaseLimit: "/api/mf/funddata/",
  triggerInvestment: "/api/invest",
  verifyCode: "/api/checkpromocode",
};

export const investCardsBase = {
  stocksAndIpo: {
    stocks: {
      title: "Stocks, Futures & Options",
      subtitle: "Invest in your favourite companies",
      button_text: "INVEST",
      icon: "ic_stocks.svg",
      tagTitle: "NEW"
    },
    ipo: {
      title: "IPO, SGB, NCD & more",
      subtitle: "Primary market products",
      button_text: "INVEST",
      icon: "ic_ipo.svg",
      tagTitle: "NEW"
    },
  },
  popularCards: {
    top_equity: {
      title: "Top equity funds",
      icon: "icn_top_equity_funds.svg",
    },
    // gold: {
    //   title: "Buy & sell 24K Gold",
    //   icon: "icn_gold.svg",
    // },
    nps: {
      title: "NPS",
      icon: "icn_nps.svg",
    },
  },
  indexFunds :{
    passiveIndexFunds: {
      button_text: "EXPLORE",
      icon: "passive_index_funds.svg",
      subtitle: "*Earn upto <b>2%</b> more than actively managed fund",
      title: "Passive index funds",
      belowCardDescription : "*Based on TER averages of regular large cap and direct index funds",
    },
  },
  ourRecommendations: {
    buildwealth: {
      title: "High growth funds (Build Wealth)",
      subtitle: "Start SIP or One-time investment",
      button_text: "START NOW",
      icon: "ic_invest_build_wealth.svg",
    },
    instaredeem: {
      title: "Insta redemption funds",
      subtitle: "Superior return and money available 24x7",
      button_text: "INVEST",
      icon: "ic_insta_fund_redemption.svg",
    },
    insurance: {
      title: "Insurance",
      subtitle: "Starting from Rs. 50 per year",
      button_text: "GET INSURED",
      icon: "ic_invest_insurance.svg",
    },
    savetax: {
      title: "Top tax saver fund (ELSS)",
      subtitle: "Invest & Save taxes up to Rs 46,800 under 80 (C)",
      button_text: "SAVE TAX",
      icon: "ic_invest_save_tax.svg",
    },
    nps: {
      title: "National Pension Scheme (NPS)",
      subtitle: "Save extra up to Rs. 15,480 under 80CCD",
      button_text: "CHECK NOW",
      icon: "ic_invest_nps.svg",
    },
    "100_sip": {
      title: "Start SIP with ₹100",
      subtitle: "Small initiative for big dreams",
      button_text: "EXPLORE FUNDS",
      icon: "ic_invest_hundered_mf.svg",
    },
    "300_sip": {
      title: "Recommended funds for you",
      subtitle: "Start SIP investment",
      button_text: "START NOW",
      icon: "ic_invest_build_wealth.svg",
    },
    // gold: {
    //   title: "Buy & sell 24K Gold",
    //   subtitle: "Starting from Rs. 100, doorstep delivery",
    //   button_text: "BUY NOW",
    //   icon: "ic_invest_gold.svg",
    // },
  },
  diy: {
    diyv2: {
      title: "Explore all Mutual funds",
      subtitle: "Check fund portfolio, past returns and more",
      button_text: "EXPLORE FUNDS",
      icon: "ic_invest_explore_mf.svg",
    },
    // gold: {
    //   title: "Buy & sell 24K Gold",
    //   subtitle: "Starting from Rs. 100, doorstep delivery",
    //   button_text: "BUY NOW",
    //   icon: "ic_invest_gold.svg",
    // },
  },
  bottomScrollCards: {
    parkmoney: {
      title: "Short term investments",
      subtitle: "",
      button_text: "",
      icon: "ic_short_term_inv.svg",
      icon_line: "ic_line.svg",
    },
    savegoal: {
      title: "Invest for a goal",
      subtitle: "",
      button_text: "",
      icon: "ic_save_for_goal.svg",
      icon_line: "ic_line.svg",
    },
  },
  bottomCards: {
    nfo: {
      title: "New funds offer (NFO)",
      subtitle: "Subscribe early at lowest price for maximum gains",
      button_text: "EXPLORE FUNDS",
      icon: "ic_invest_nfo.svg",
    },
  },
  financialTools: {
    fhc: {
      title: "Financial health check",
      subtitle: "Get an expert financial advice",
      button_text: "CHECK NOW",
      icon: "ic_fin_tools_fhc.svg",
    },
    risk_profile: {
      title: "Risk profiler",
      subtitle: "Invest as per your risk appetite",
      button_text: "START NOW",
      icon: "ic_fin_tools_risk.svg",
    }
  },
};

export const keyPathMapper = {
  nfo: "/advanced-investing/new-fund-offers/info",
  passiveIndexFunds: "/passive-index-funds/landing",
  instaredeem: "invest/instaredeem",
  buildwealth: "invest/buildwealth",
  savetax: "invest/savetax",
  nps: "/nps/info",
  diyv2: "invest/explore-v2",
  parkmoney: "invest/parkmoney",
  savegoal: "invest/savegoal",
  insurance: "/group-insurance",
  gold: "/gold/my-gold",
  fhc: "/fhc",
  top_equity: "/diyv2/Equity/landing",
};

export const investRedeemData = {
  benefits: [
    {
      disc: "Upto 6%* return",
      key: "return",
      icon: "ic_higher_returns.svg",
    },
    {
      disc: "Zero exposure to equity",
      key: "risk",
      icon: "ic_low_risk.svg",
    },
    {
      disc: "Get money back into your account within 30 mins",
      key: "withdrawal",
      icon: "ic_withdrawal.svg",
    },
  ],
  faqData: [
    {
      title: "What are the steps for investment?",
      subtitle:
        "It is a simple three-step process, first select the mode of investment (SIP/one-time), second enter the amount and finally make the payment.",
    },
    {
      title: "Is there any lock-in period for investment?",
      subtitle:
        "No, there is no lock-in period for investment but if you withdraw within 7 days of investment, a nominal exit load applies.",
    },
    {
      title: "Can I withdraw my money on holidays?",
      subtitle:
        "Yes, you can withdraw your money even on holidays and it will be processed to your bank account.",
    },
  ],
  withdrawSteps: {
    title: "How to withdraw?",
    options: [
      {
        subtitle: "1. Go to Instant withdraw in portfolio and enter amount",
        key: "portfolio",
        icon: "ic_gold_provider",
      },
      {
        subtitle: "2. Money will be credited to your bank a/c within 30 mins",
        key: "withdrawal",
        icon: "ic_auth_bank",
      },
    ],
  },
  tagsMapper: {
    sip: [
      { name: "500", value: 500 },
      { name: "1000", value: 1000 },
      { name: "2000", value: 2000 },
      { name: "5000", value: 5000 },
    ],
    onetime: [
      { name: "1000", value: 1000 },
      { name: "5000", value: 5000 },
      { name: "10K", value: 10000 },
      { name: "15K", value: 15000 },
    ],
  },
  investTypeData: {
    options: [
      {
        text: "SIP",
        value: "sip",
        icon: "ic_sip.svg",
      },
      {
        text: "One Time",
        value: "onetime",
        icon: "ic_onetime.svg",
      },
    ],
  },
};

export const nfoData = {
  info: [
    {
      title: "Low NAV",
      subtitle: "Accumulate more units at lower NAV",
      icon: "low_nav_icon.png",
    },
    {
      title: "Growth Journey",
      subtitle: "Be a part of the fund's growth journey",
      icon: "growth_journey_icon.png",
    },
    {
      title: "Interesting Themes",
      subtitle: "Many NFOs are launched to manage new opportunities",
      icon: "interesting_themes_icon.png",
    },
    {
      title: "Innovative Products",
      subtitle: "Products with unique features",
      icon: "innovative_products_icon.png",
    },
  ],
  scheme: [
    {
      title: "Growth",
      subtitle:
        "All your gains continue to grow in the fund & benefit from the compounding effect",
      icon: "growth_icon.png",
      value: "growth",
    },
    {
      title: "Dividend",
      subtitle:
        "The fund to pay out fractions of your gains in the form of periodic dividends",
      icon: "dividend_icon.png",
      value: "dividend",
    },
  ],
  checkoutInvestType: [
    {
      value: "sip",
      name: "SIP / Monthly",
      icon: "sip_icn.svg",
      icon_light: "sip_icn_light.png",
      selected_icon: "selected.svg",
    },
    {
      value: "onetime",
      name: "One Time",
      icon: "one_time_icn.svg",
      icon_light: "one_time_icn_light.png",
      selected_icon: "selected.svg",
    },
  ],
};

export const kycStatusMapper = {
  init: {
    title: "Are you investment ready",
    subtitle:
      "Complete KYC to invest in stocks, IPOs, F&O & primary market products",
    buttonTitle: "Start KYC",
    button2Title: "Later",
    landingText: "Check your KYC status",
    icon: "kyc_default.svg",
    nextState: KYC_PATHNAME_MAPPER.journey
  },
  ground: {
    title: "Are you investment ready",
    subtitle:
      "Complete KYC to invest in stocks, IPOs, F&O & primary market products",
    buttonTitle: "Start KYC",
    button2Title: "Later",
    landingText: "Check your KYC status",
    icon: "kyc_default.svg",
    nextState: KYC_PATHNAME_MAPPER.homeKyc
  },
  submitted: {
    color: "#3792fc",
    title: "Verifying KYC",
    subtitle:
      "We’ll notify you once KYC verification is done. This may take up to 12 hours",
    primaryButtonTitle: "Continue",
    buttonTitle: "OKAY",
    oneButton: true,
    landingText: "UNDER PROCESS",
    icon: "kyc_inprogress.svg",
  },
  rejected: {
    color: "#d0021b",
    title: "KYC rejected",
    subtitle: "Tap UPDATE KYC to re-submit the correct documents",
    buttonTitle: "Update kyc",
    button2Title: "Later",
    icon: "kyc_rejected.svg",
    landingText: "PENDING",
    nextState: KYC_PATHNAME_MAPPER.uploadProgress
  },
  incomplete: {
    color: "#ffa60b",
    title: "KYC pending",
    subtitle:
      "KYC is a mandatory process to invest in stocks, primary market products, F&O",
    icon: "kyc_complete_setup.svg",
    button2Title: "Later",
    buttonTitle: "COMPLETE NOW",
    landingText: "INCOMPLETE",
    nextState: KYC_PATHNAME_MAPPER.journey
  },
  complete: {
    color: "#ffa60b",
    title: "Upgrade to trading and demat account",
    subtitle: "Invest in India's top companies in just a few taps",
    button2Title: "Later",
    buttonTitle: "UPGRADE NOW",
    icon: "kyc_upgrade.svg",
  },
  mf_complete: {
    color: "#ffa60b",
    title: "You're investment ready",
    subtitle: "You can now invest in more than 5000+ mutual funds.",
    oneButton: true,
    buttonTitle: "OKAY",
    icon: "kyc_esign.svg",
    nextState: "/invest",
  },
  upgraded_incomplete: {
    title: "Upgrade to trading and demat account",
    subtitle: "Invest in India's top companies in just a few taps",
    button2Title: "Later",
    buttonTitle: "UPGRADE NOW",
    icon: "kyc_upgrade.svg",
    nextState: KYC_PATHNAME_MAPPER.tradingInfo
  },
  esign_pending: {
    color: "#ffa60b",
    title: "Documents verified",
    subtitle:
      "Great, just one more step to go! Now complete eSign to get investment ready",
    button2Title: "NOT NOW",
    buttonTitle: "Complete esign",
    landingText: "INCOMPLETE",
    icon: "kyc_esign.svg",
    oneButton: true,
    nextState: KYC_PATHNAME_MAPPER.kycEsign,
  },
  fno_rejected: {
    color: "#d0021b",
    title: "Income proof rejected",
    subtitle:
      "F&O application was not processed due to wrong income proof. Please upload the correct document to proceed",
    button2Title: "Later",
    buttonTitle: "Update document",
    landingText: "INCOMPLETE",
    icon: "kyc_rejected.svg",
    nextState: KYC_PATHNAME_MAPPER.uploadFnOIncomeProof,
    dualButton: true,
  },
  verifying_trading_account: {
    color: "#3792fc",
    title: "Trading and Demat account set up in progress",
    subtitle: "Meanwhile, you can invest in more than 5000+ mutual funds",
    buttonTitle: "OK",
    oneButton: true,
    landingText: "UNDER PROCESS",
    icon: "kyc_inprogress.svg",
  },
  kyc_verified: {
    color: "#ffa60b",
    title: "You're ready to invest",
    subtitle:
      "Start investing in your favourite stocks, IPOs, F&O, mutual funds & more",
    buttonTitle: "OKAY",
    oneButton: true,
    icon: "kyc_esign.svg",
  },
  complete_account_setup: {
    title: "2 more steps to go!",
    subtitle:
      "Complete opening your Trading & Demat account to start investing in stocks, F&O & more",
    buttonTitle: "Continue with Account opening",
    landingText: "PENDING",
    oneButton: true,
    icon: "kyc_complete_setup.svg",
    nextState: KYC_PATHNAME_MAPPER.aocSelectAccount,
  },
  mf_esign_pending: {
    color: "#ffa60b",
    title: "Complete KYC",
    subtitle: "KYC is a mandatory process to invest in Mutual Funds, stocks and other primary market products",
    button2Title: "Later",
    buttonTitle: "COMPLETE NOW",
    landingText: "INCOMPLETE",
    icon: "kyc_complete_setup.svg",
    nextState: KYC_PATHNAME_MAPPER.kycEsign
  }
};

export const kycStatusMapperInvest = {
  init: {
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    buttonTitle: "Check now",
    icon: "kyc_default.svg",
    eventStatus: "Are you investment ready?",
    nextState: KYC_PATHNAME_MAPPER.journey,
  },
  ground: {
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    buttonTitle: "Check now",
    icon: "kyc_default.svg",
    eventStatus: "Are you investment ready?",
    nextState: KYC_PATHNAME_MAPPER.homeKyc,
  },
  ground_premium: {
    icon: "kyc_default.svg",
    title: "Premium onboarding",
    subtitle: "No documentation  |  Instant investment",
    buttonTitle: "Complete now",
    eventStatus: "complete your KYC",
    nextState: KYC_PATHNAME_MAPPER.journey,
  },
  ground_pan: {
    title: "Complete your KYC",
    subtitle: "Just a few more steps to go",
    buttonTitle: "Complete now",
    icon: "kyc_default.svg",
    eventStatus: "complete your KYC",
    nextState: KYC_PATHNAME_MAPPER.journey
  },
  ground_aadhaar: {
    title: "Complete your KYC",
    subtitle: "Just a few more steps to go",
    buttonTitle: "Complete now",
    icon: "kyc_default.svg",
    eventStatus: "complete your KYC",
    nextState: KYC_PATHNAME_MAPPER.journey,
  },
  incomplete: {
    title: "Complete your KYC",
    subtitle: "Just a few more steps to go",
    buttonTitle: "Complete now",
    icon: "kyc_default.svg",
    eventStatus: "complete your KYC",
    nextState: KYC_PATHNAME_MAPPER.journey,
  },
  rejected: {
    title: "KYC application rejected",
    subtitle: "Your documents couldn’t be verified",
    buttonTitle: "review & Modify",
    icon: "kyc_rejected.svg",
    eventStatus: "kyc application rejected",
    descriptionColor: "foundationColors.secondary.lossRed.400",
    nextState: KYC_PATHNAME_MAPPER.uploadProgress,
  },
  fno_rejected: {
    title: "F&O verification failed",
    subtitle: "We’re unable to verify the documents submitted to activate F&O",
    buttonTitle: "review & Modify",
    icon: "kyc_rejected.svg",
    eventStatus: "f & o verification failed",
    descriptionColor: "foundationColors.secondary.lossRed.400",
    nextState: KYC_PATHNAME_MAPPER.uploadFnOIncomeProof,
  },
  submitted: {
    title: "KYC application submitted",
    subtitle: "In progress",
    buttonTitle: "track status",
    icon: "kyc_inprogress.svg",
    eventStatus: "kyc application submitted",
    descriptionColor: "foundationColors.secondary.coralOrange.400",
  },
  complete: {
    title: "Upgrade to Trading & Demat account",
    subtitle: "STOCKS | IPO | F&O",
    buttonTitle: "Upgrade now",
    descriptionColor: "foundationColors.secondary.profitGreen.400",
    eventStatus: "upgrade to trading & demat account",
    icon: "kyc_upgrade.svg",
    nextState: KYC_PATHNAME_MAPPER.tradingInfo,
  },
  upgraded_incomplete: {
    title: "Upgrade to Trading & Demat account",
    subtitle: "STOCKS | IPO | F&O",
    buttonTitle: "Upgrade now",
    descriptionColor: "foundationColors.secondary.profitGreen.400",
    eventStatus: "upgrade to trading & demat account",
    icon: "kyc_upgrade.svg",
    nextState: KYC_PATHNAME_MAPPER.tradingInfo,
  },
  esign_pending: {
    title: "KYC documents verified",
    subtitle: "Now eSign to complete application",
    buttonTitle: "eSIGN now",
    eventStatus: "kyc documents verified",
    icon: "kyc_esign.svg",
    nextState: KYC_PATHNAME_MAPPER.kycEsign,
  },
  verifying_trading_account: {
    title: "You’re ready to invest in mutual funds",
    subtitle: "Trading account set up in progress",
    buttonTitle: "track status",
    icon: "kyc_inprogress.svg",
    eventStatus: "you are ready to invest in mutual funds",
    descriptionColor: "foundationColors.secondary.coralOrange.400",
  },
  complete_account_setup: {
    title: "Complete account set up",
    subtitle: "Only a few steps remaining",
    buttonTitle: "Continue ",
    eventStatus: "complete account setup",
    icon: "kyc_complete_setup.svg",
    nextState: KYC_PATHNAME_MAPPER.aocSelectAccount,
  },
  mf_esign_pending: {
    title: "Complete your KYC",
    subtitle: "Just a few more steps to go",
    buttonTitle: "Complete now",
    icon: "kyc_default.svg",
    eventStatus: "complete your KYC",
    nextState: KYC_PATHNAME_MAPPER.kycEsign,
  }
};

export const premiumBottomSheetMapper = {
  ground_premium: {
    title: `Premium Onboarding`,
    subtitle: `Congratulations! You have been selected for premium onboarding. Fast track your investment journey.`,
    buttonTitle: "CONTINUE",
    oneButton: true,
    nextState: KYC_PATHNAME_MAPPER.journey,
    icon: "premium.svg",
    instant: true,
  },
  init: {
    title: "Premium Onboarding",
    subtitle: "Fast track your investment with Premium onboarding!",
    buttonTitle: "COMPLETE NOW",
    button2Title: "Not now",
    nextState: KYC_PATHNAME_MAPPER.journey,
    icon: "premium.svg",
  },
  incomplete: {
    title: `Premium Onboarding`,
    subtitle: "Fast track your investment with Premium onboarding!",
    buttonTitle: "COMPLETE NOW",
    button2Title: "Not now",
    nextState: KYC_PATHNAME_MAPPER.journey,
    icon: "premium.svg",
  },
  complete: {
    title: `Congratulations! KYC verified`,
    subtitle: "You're ready to invest in Mutual Funds",
    buttonTitle: "START INVESTING",
    nextState: "/invest",
    icon: "premium.svg",
  }
};

export const riskProfiles = [{
  name: 'Aggressive',
  desc: 'Willing to take significant risk for high growth',
}, {
  name: 'Moderately Aggressive',
  desc: 'Fair risk in exchange for significant growth',
}, {
  name: 'Moderate',
  desc: 'Want balance between growth and risk',
}, {
  name: 'Moderately Conservative',
  desc: 'Focused on modest growth with low risk',
}, {
  name: 'Conservative',
  desc: 'Risk averse. Focused on Capital Preservation',
}, {
  name: 'Custom',
  desc: 'User created equity to debt distribution',
}];

export const sdkInvestCardMapper = [
  {
    key: 'invest',
    title: 'Start investing',
    titleImg: 'ic_db_invest_solid.svg',
    subtitle: 'Mutual Funds',
    img: 'ic_db_invest.svg',
    height: '133px',
    path: '/invest'
  },
  {
    key: 'portfolio',
    title: 'My portfolio',
    subtitle: 'Track investment, Withdraw',
    img: 'ic_db_portfolio.svg',
    path: '/reports'
  },
  {
    key: 'account',
    title: 'My Account',
    subtitle: 'Account details, Mandate',
    img: 'ic_db_account.svg',
    path: '/my-account'
  },
  {
    key: 'refer',
    title: 'Refer & Earn',
    subtitle: 'Refer to your friends & earn rewards',
    img: 'ic_db_refer.svg',
    path: '/refer'
  },
  {
    key: 'help',
    title: 'Help & support',
    subtitle: 'Read FAQs, contact us',
    img: 'ic_db_help.svg',
    path: '/help'
  }
]

export const flowName = {
  buildwealth: "build wealth",
  diy: "diy",
  "insta-redeem": "insta-redeem",
  saveforgoal: "invest for goal",
  nfo: "nfo",
  investsurplus: "park my savings",
  saveTax: "tax saving",
};
export const prepareInvestMaaper = [
  {
    key: "invest",
    title: "Start investing",
    titleImg: "ic_db_invest_solid.svg",
    subtitle: "Mutual Funds, Save tax",
    img: "ic_db_invest.svg",
    height: "133px",
    path: "/",
  },
  {
    key: "portfolio",
    title: "My portfolio",
    subtitle: "Track investment, Withdraw",
    img: "ic_db_portfolio.svg",
  },
  {
    key: "account",
    title: "My Account",
    subtitle: "Account details, Mandate",
    img: "ic_db_account.svg",
  },
  {
    key: "kyc",
    title: "KYC",
    subtitle: "Create investment profile",
    img: "ic_db_kyc.svg",
  },
  {
    key: "refer",
    title: "Refer & Earn",
    subtitle: "Refer to your friends & earn rewards",
    img: "ic_db_refer.svg",
    path:"/refer"
  },
];
