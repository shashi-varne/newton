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
  init: "",
  submitted: {
    color: "#3792fc",
    popup_header: "KYC verification is under process",
    popup_message:
      "Our team is working on your KYC application, we will notify by email and sms once it's done",
    button_text: "OK",
    oneButton: true,
    landing_text: "UNDER PROCESS",
    icon: "ic_popup_kyc_underprocess.svg",
  },
  rejected: {
    color: "#d0021b",
    popup_header: "Sorry, Your KYC is still pending",
    popup_message: "KYC document rejected",
    button_text: "Update KYC",
    landing_text: "PENDING",
    icon: "ic_popup_kyc_pending.svg",
    next_state: "/kyc/upload/progress",
  },
  incomplete: {
    color: "#ffa60b",
    popup_header: "",
    popup_message: "",
    button_text: "",
    landing_text: "INCOMPLETE",
    icon: "ic_popup_kyc_pending.svg",
  },
  complete: {
    color: "#ffa60b",
    popup_header: "Congratulations! KYC verified",
    popup_message: "You're ready to invest in Mutual Funds",
    button_text: "START INVESTING",
    icon: "ic_popup_kyc_verified.svg",
    next_state: "/invest",
  },
};

export const kycStatusMapperInvest = {
  init: {
    icon: "ic_card_kyc_default.svg",
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    button_text: "CREATE NOW",
    next_state: "/kyc/journey",
  },
  ground: {
    icon: "ic_card_kyc_default.svg",
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    button_text: "CREATE NOW",
    next_state: "/kyc/home",
  },
  ground_premium: {
    icon: "ic_card_kyc_default.svg",
    title: "Premium onboarding",
    subtitle: "No documentation  |  Instant investment",
    button_text: "COMPLETE NOW",
    next_state: "/kyc/journey",
  },
  ground_pan: {
    icon: "ic_card_kyc_default.svg",
    title: "Complete your KYC",
    subtitle: "Don’t miss out good returns by Delaying",
    button_text: "COMPLETE NOW",
    next_state: "/kyc/journey"
  },
  ground_aadhaar: {
    icon: "ic_card_kyc_default.svg",
    title: "Complete your KYC",
    subtitle: "Don’t miss out good returns by Delaying",
    button_text: "COMPLETE NOW",
    next_state: "/kyc/journey",
  },
  incomplete: {
    icon: "ic_card_kyc_default.svg",
    title: "Complete your KYC",
    subtitle: "Don’t miss out good returns by Delaying",
    button_text: "COMPLETE NOW",
    next_state: "/kyc/journey",
  },
  rejected: {
    icon: "ic_card_kyc_pending.svg",
    title: "KYC still pending",
    subtitle: "KYC document rejected",
    button_text: "UPDATE KYC",
    next_state: "/kyc/upload/progress",
  },
  fno_rejected: {
    icon: "ic_card_kyc_pending.svg",
    title: "FnO Doc Rejected",
    subtitle: "FnO rejected",
    button_text: "UPDATE FnO",
    next_state: "/kyc/upload/fno-income-proof",
  },
  submitted: {
    icon: "ic_card_kyc_underprocess.svg",
    title: "KYC application submitted",
    subtitle: "Verification in-progress",
    button_text: "CHECK STATUS",
    next_state: "/kyc/upload/progress",
  },
  complete: {
    icon: "ic_card_kyc_default.svg",
    title: "Upgrade your account",
    subtitle: "Don’t miss out good returns by Delaying",
    button_text: "UPGRADE NOW",
    next_state: "/kyc/journey",
  },
  esign_pending: {
    icon: "ic_card_kyc_default.svg",
    title: "Complete Esign",
    subtitle: "Don’t miss out good returns by Delaying",
    button_text: "COMPLETE ESIGN",
    next_state: "/kyc-esign/info",
  },
};

export const premiumBottomSheetMapper = {
  ground_premium: {
    popup_header: `Premium Onboarding`,
    title: "Premium Onboarding",
    bold_text: "Congratulations!",
    popup_message: `You have been selected for Premium onboarding. Fast track your investment journey.`,
    button_text: "CONTINUE",
    oneButton: true,
    next_state: "/kyc/journey",
    icon: "ic_premium_onboarding_small.svg",
  },
  init: {
    popup_header: "Premium Onboarding",
    title: "Premium Onboarding",
    popup_message: "Fast track your investment with Premium onboarding!",
    button_text: "COMPLETE NOW",
    next_state: "/kyc/journey",
    icon: "ic_popup_premium_onboarding_big.svg",
  },
  incomplete: {
    popup_header: `Premium Onboarding`,
    title: "Premium Onboarding",
    popup_message: "Fast track your investment with Premium onboarding!",
    button_text: "COMPLETE NOW",
    next_state: "/kyc/journey",
    icon: "ic_popup_premium_onboarding_big.svg",
  },
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
