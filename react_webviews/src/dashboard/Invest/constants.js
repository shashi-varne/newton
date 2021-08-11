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
    },
    ipo: {
      title: "IPO, Gold Bonds and more",
      subtitle: "Primary market products",
      button_text: "INVEST",
      icon: "ic_ipo.svg",
    },
  },
  popularCards: {
    top_equity: {
      title: "Top equity funds",
      icon: "icn_top_equity_funds.svg",
    },
    gold: {
      title: "Buy & sell 24K Gold",
      icon: "icn_gold.svg",
    },
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
    gold: {
      title: "Buy & sell 24K Gold",
      subtitle: "Starting from Rs. 1000, doorstep delivery",
      button_text: "BUY NOW",
      icon: "ic_invest_gold.svg",
    },
  },
  diy: {
    diyv2: {
      title: "Explore all Mutual funds",
      subtitle: "Check fund portfolio, past returns and more",
      button_text: "EXPLORE FUNDS",
      icon: "ic_invest_explore_mf.svg",
    },
    gold: {
      title: "Buy & sell 24K Gold",
      subtitle: "Starting from Rs. 1000, doorstep delivery",
      button_text: "BUY NOW",
      icon: "ic_invest_gold.svg",
    },
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
  diyv2: "invest/explore",
  parkmoney: "invest/parkmoney",
  savegoal: "invest/savegoal",
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
        "The fund to pay out fractions of your gains in form of periodic dividends",
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
  ground: {
    title: "Are you investment ready?",
    subtitle:
      "To invest in stocks, primary market products, F&O you need to verify your KYC",
    buttonTitle: "Start KYC",
    button2Title: "Later",
    landingText: "Check your KYC status",
    icon: "icn_kyc_incomplete.svg",
    nextState: "/kyc/home",
  },
  submitted: {
    color: "#3792fc",
    title: "Verifying KYC",
    subtitle:
      "Our team is working on your KYC application. We will notify you once it’s done. This may take upto 48 hours",
    buttonTitle: "OKAY",
    oneButton: true,
    landingText: "UNDER PROCESS",
    icon: "icn_kyc_doc_verification.svg",
  },
  rejected: {
    color: "#d0021b",
    title: "KYC application rejected ",
    subtitle: "We were unable to process your KYC. Please tap 'Update KYC' to check and submit the correct documents",
    buttonTitle: "Update KYC",
    landingText: "PENDING",
    button2Title: "Later",
    icon: "icn_kyc_doc_rejected.svg",
    nextState: "/kyc/upload/progress",
  },
  incomplete: {
    color: "#ffa60b",
    title: "Complete KYC",
    subtitle: "KYC is a mandatory process to invest in stocks, primary market products, F&O",
    button2Title: "Later",
    buttonTitle: "COMPLETE NOW",
    landingText: "INCOMPLETE",
    icon: "icn_kyc_incomplete.svg",
  },
  complete: {
    color: "#ffa60b",
    title: "Upgrade to trading and demat account",
    subtitle: "Invest in India's best performing stocks in just a few taps!",
    button2Title: "Later",
    buttonTitle: "UPGRADE NOW",
    icon: "ic_upgrade.svg",
  },
  mf_complete: {
    color: "#ffa60b",
    title: "Congratulations! KYC verified",
    subtitle: "You're ready to invest in Mutual Funds",
    buttonTitle: "START INVESTING",
    icon: "icn_kyc_completed.svg",
    nextState: "/invest",
  },
  esign_pending: {
    color: "#ffa60b",
    title: "Documents verified",
    subtitle: "Great, just one more step to go! Now complete eSign to get investment ready",
    button2Title: "NOT NOW",
    buttonTitle: "Complete esign",
    landingText: "INCOMPLETE",
    icon: "icn_kyc_completed.svg",
  },
  fno_rejected: {
    color: "#d0021b",
    title: "Income proof rejected",
    subtitle: "Couldn't process your F&O application as the wrong income proof document was submitted. Please upload the correct file",
    button2Title: "Later",
    buttonTitle: "Update document",
    landingText: "INCOMPLETE",
    icon: "icn_kyc_doc_rejected.svg",
  },
  equity_activation_pending: {
    color: "#3792fc",
    title: "Trading & Demat account set up in progress",
    subtitle: "Meanwhile, you can invest in more than 5000+ mutual funds",
    buttonTitle: "OK",
    oneButton: true,
    landingText: "UNDER PROCESS",
    icon: "icn_kyc_doc_verification.svg",
  },
  kyc_verified: {
    color: "#ffa60b",
    title: "You're investment ready",
    subtitle: "You can start your investment journey by investing in your favourite stocks, mutual funds, F&O ",
    buttonTitle: "OKAY",
    oneButton: true,
    icon: "icn_kyc_completed.svg",
  }
};

export const kycStatusMapperInvest = {
  init: {
    icon: "ic_kyc_incomplete.svg",
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    nextState: "/kyc/journey",
  },
  ground: {
    icon: "ic_kyc_incomplete.svg",
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    nextState: "/kyc/home",
  },
  ground_premium: {
    icon: "ic_kyc_incomplete.svg",
    title: "Premium onboarding",
    subtitle: "No documentation  |  Instant investment",
    nextState: "/kyc/journey",
  },
  ground_pan: {
    icon: "ic_kyc_incomplete.svg",
    title: "Complete your KYC",
    subtitle: "You’re just a few steps away!",
    nextState: "/kyc/journey"
  },
  ground_aadhaar: {
    icon: "ic_kyc_incomplete.svg",
    title: "Complete your KYC",
    subtitle: "You’re just a few steps away!",
    nextState: "/kyc/journey",
  },
  incomplete: {
    icon: "ic_kyc_incomplete.svg",
    title: "Complete your KYC",
    subtitle: "You’re just a few steps away!",
    nextState: "/kyc/journey",
  },
  rejected: {
    icon: "ic_kyc_rejected.svg",
    title: "KYC application",
    subtitle: "REJECTED",
    nextState: "/kyc/upload/progress",
    addPoint: true,
    subTitleClass: "kyc-rejected",
    subtitleColor: "var(--red)"
  },
  fno_rejected: {
    icon: "ic_kyc_rejected.svg",
    title: "F&O verification",
    subtitle: "DOCUMENT REJECTED",
    nextState: "/kyc/upload/fno-income-proof",
    addPoint: true,
    subTitleClass: "kyc-rejected",
    subtitleColor: "var(--red)"
  },
  submitted: {
    icon: "ic_kyc_under_process.svg",
    title: "KYC application",
    subtitle: "IN-PROGRESS",
    nextState: "/kyc-esign/nsdl",
    addPoint: true,
    subTitleClass: "kyc-submitted",
    subtitleColor: "var(--mustard)"
  },
  complete: {
    icon: "ic_kyc_complete.svg",
    title: "You’re ready to invest in mutual funds",
    subtitle: "UPGRAGE ACCOUNT",
    nextState: "/kyc/trading-info",
    subTitleClass: "kyc-complete",
  },
  esign_pending: {
    icon: "ic_kyc_complete.svg",
    title: "KYC application",
    subtitle: "COMPLETE ESIGN",
    nextState: "/kyc-esign/info",
    subTitleClass: "kyc-complete",
  },
  equity_activation_pending: {
    icon: "ic_kyc_under_process.svg",
    title: "You’re ready to invest in mutual funds",
    subtitle: "VERIFYING TRADING A/C",
    addPoint: true,
    subTitleClass: "kyc-submitted",
    subtitleColor: "var(--mustard)"
  }
};

export const premiumBottomSheetMapper = {
  ground_premium: {
    title: `Premium Onboarding`,
    boldText: "Congratulations!",
    subtitle: `You have been selected for Premium onboarding. Fast track your investment journey.`,
    buttonTitle: "CONTINUE",
    oneButton: true,
    nextState: "/kyc/journey",
    icon: "ic_premium_onboarding_small.svg",
  },
  init: {
    title: "Premium Onboarding",
    subtitle: "Fast track your investment with Premium onboarding!",
    buttonTitle: "COMPLETE NOW",
    nextState: "/kyc/journey",
    icon: "ic_popup_premium_onboarding_big.svg",
  },
  incomplete: {
    title: `Premium Onboarding`,
    subtitle: "Fast track your investment with Premium onboarding!",
    buttonTitle: "COMPLETE NOW",
    nextState: "/kyc/journey",
    icon: "ic_popup_premium_onboarding_big.svg",
  },
  complete: {
    title: `Congratulations! KYC verified`,
    subtitle: "You're ready to invest in Mutual Funds",
    buttonTitle: "START INVESTING",
    nextState: "/invest",
    icon: "ic_popup_kyc_verified.svg",
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
    key: 'kyc',
    title: 'KYC',
    subtitle: 'Create investment profile',
    img: 'ic_db_kyc.svg',
    path: '/kyc'
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
  {
    key: "refer",
    referralCode: true,
    title: "Referral Code",
    img: "ic_db_refer.svg",
  },
];
