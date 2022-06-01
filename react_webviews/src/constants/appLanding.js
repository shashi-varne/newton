export const KYC_CARD_STATUS_MAPPER = {
  init: {
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    buttonTitle: "Check now",
    icon: "kyc_default.svg",
    eventStatus: "Are you investment ready?",
  },
  incomplete: {
    title: "Complete your KYC",
    subtitle: "Just a few more steps to go",
    buttonTitle: "Complete now",
    icon: "kyc_default.svg",
    eventStatus: "complete your KYC",
  },
  submitted: {
    title: "KYC application submitted",
    subtitle: "In progress",
    buttonTitle: "track status",
    icon: "kyc_inprogress.svg",
    eventStatus: "kyc application submitted",
    descriptionColor: "foundationColors.secondary.coralOrange.400",
  },
  rejected: {
    title: "KYC application rejected",
    subtitle: "Your documents couldn’t be verified",
    buttonTitle: "review & Modify",
    icon: "kyc_rejected.svg",
    eventStatus: "kyc application rejected",
    descriptionColor: "foundationColors.secondary.lossRed.400",
  },
  complete_setup: {
    title: "Complete account set up",
    subtitle: "Only a few steps remaining",
    buttonTitle: "Continue ",
    eventStatus: "complete account setup",
    icon: "kyc_complete_setup.svg",
  },
  esign_ready: {
    title: "KYC documents verified",
    subtitle: "Now eSign to complete application",
    buttonTitle: "eSIGN now",
    eventStatus: "kyc documents verified",
    icon: "kyc_esign.svg",
  },
  verifying_trading_account: {
    title: "You’re ready to invest in mutual funds",
    subtitle: "Trading account set up in progress",
    buttonTitle: "track status",
    icon: "kyc_inprogress.svg",
    eventStatus: "you are ready to invest in mutual funds",
    descriptionColor: "foundationColors.secondary.coralOrange.400",
  },
  fno_rejected: {
    title: "F&O verification failed",
    subtitle: "We’re unable to verify the documents submitted to activate F&O",
    buttonTitle: "review & Modify",
    icon: "kyc_rejected.svg",
    eventStatus: "f & o verification failed",
    descriptionColor: "foundationColors.secondary.lossRed.400",
  },
  upgrade_incomplete: {
    title: "Upgrade to Trading & Demat account",
    subtitle: "STOCKS | IPO | F&O",
    buttonTitle: "Continue ",
    descriptionColor: "foundationColors.secondary.profitGreen.400",
    eventStatus: "upgrade to trading & demat account",
    icon: "kyc_upgrade.svg",
  },
};

export const MANAGE_INVESTMENTS = [
  {
    icon: "portfolio.svg",
    title: "Portfolio",
  },
  {
    icon: "account.svg",
    title: "Account",
  },
  {
    icon: "help.svg",
    title: "Help",
  },
];

export const PLATFORM_MOTIVATORS = [
  {
    icon: "one_kyc.json",
    title: "One KYC for Mutual Funds & Stocks",
    subtitle: "Easy. Paperless. Secure",
    dataAid: "oneKyc",
    id: "kyc",
  },
  {
    icon: "withdrawal.json",
    title: "Convenient & easy withdrawals",
    subtitle: "Get money in savings bank A/c.",
    dataAid: "withdrawal",
  },
  {
    icon: "account_manage.json",
    title: "Manage your SIPs with ease",
    subtitle: "Pause, edit, cancel in 1 tap ",
    dataAid: "manageSips",
  },
  {
    icon: "order_place.json",
    title: "Seamless order placement",
    subtitle: "Select fund, add amount & pay!",
    dataAid: "orderPlacement",
  },
  {
    icon: "insights.json",
    title: "Track investments real-time",
    subtitle: "With in-depth portfolio tracking",
    dataAid: "trackInvestment",
  },
];

export const MARKETING_BANNERS = [
  {
    icon: `freedomplan.svg`,
    id: "freedomplan",
    eventStatus: "introducing freedom plan",
  },
  {
    icon: `freedomplan.svg`,
    eventStatus: "save tax",
    id: "savetax",
  },
  {
    icon: `freedomplan.svg`,
  },
  {
    icon: `freedomplan.svg`,
  },
];

export const INVESTMENT_OPTIONS = {
  stocks: {
    icon: "stocks.svg",
    title: "Stocks & F&O",
    subtitle: "Invest in your favourite companies",
    dataAid: "stocks",
    eventStatus: "stocks, f&o",
    id: "stocks",
  },
  ipo: {
    icon: "ipo.svg",
    title: "IPOs",
    subtitle: "Invest in primary market products",
    eventStatus: "ipos",
    dataAid: "ipoSgbNcd",
    id: "ipo",
  },
  mf: {
    icon: "mf.svg",
    title: "Mutual funds",
    subtitle: "Top performing funds for your goals",
    eventStatus: "mutual funds",
    dataAid: "mutualFunds",
    id: "mf",
  },
  nps: {
    icon: "nps.svg",
    title: "National pension scheme",
    subtitle: "Invest today for a secure retirement",
    eventStatus: "national pension scheme",
    dataAid: "nps",
    id: "nps",
  },
  insurance: {
    icon: "io_insurance.svg",
    title: "Insurance",
    subtitle: "Build a safety net for your future",
    eventStatus: "Insurance",
    dataAid: "insurance",
    id: "insurance",
  },
  taxFiling: {
    icon: "tax_filing.svg",
    title: "Free tax filing",
    subtitle: "Save and file your ITRs fast",
    eventStatus: "tax filing",
    dataAid: "taxFiling",
    id: "taxFiling",
  },
  buildwealth: {
    icon: "high_growth.svg",
    title: "High growth funds",
    subtitle: "Start with as low as ₹500 ",
    eventStatus: "high growth funds",
    id: "buildwealth",
    dataAid: "highGrowthFunds",
  },
  nfo: {
    icon: "new_fund.svg",
    title: "New fund offer",
    subtitle: "Invest in newly launched funds",
    eventStatus: "new fund offer(nfo) ",
    id: "nfo",
    dataAid: "newFund",
  },
  parkmoney: {
    icon: "park_money.svg",
    title: "Park your savings",
    subtitle: "Make your idle money work ",
    eventStatus: "park my savings",
    id: "parkmoney",
    dataAid: "parkMySavings",
  },
  viewAll: {
    icon: "view_all.svg",
    title: "View all",
    subtitle: "Invest as per your unique needs",
    eventStatus: "view all",
    id: "viewAll",
    dataAid: "viewAll",
  },
  elss: {
    icon: "tax_saving.svg",
    title: "Tax saving funds",
    subtitle: "Save tax up to ₹46,800",
    eventStatus: "save tax",
    id: "elss",
    dataAid: "taxSavingFund",
  },
  savegoal: {
    icon: "invest_goal.svg",
    title: "Invest for a goal",
    subtitle: "Plans for every investment goal",
    eventStatus: "invest for a goal",
    id: "savegoal",
    dataAid: "goalFund",
  },
  instaredeem: {
    icon: "insta_redeem.svg",
    title: "Insta redemption funds",
    subtitle: "Superior return and money available 24x7",
    eventStatus: "Insta redemption funds",
    id: "instaredeem",
    dataAid: "instaRedemptionFund",
  },
};

export const MF_INVESTMENT_OPTIONS = [
  {
    icon: "high_growth.svg",
    title: "High growth funds",
    subtitle: "Start with as low as ₹500 ",
    eventStatus: "high growth funds",
    id: "buildwealth",
    dataAid: "highGrowthFunds",
  },
  {
    icon: "new_fund.svg",
    title: "New fund offer",
    subtitle: "Invest in newly launched funds",
    eventStatus: "new fund offer(nfo) ",
    id: "nfo",
    dataAid: "newFund",
  },
  {
    icon: "park_money.svg",
    title: "Park your savings",
    subtitle: "Make your idle money work ",
    eventStatus: "park my savings",
    id: "parkMoney",
    dataAid: "parkMySavings",
  },
  {
    icon: "view_all.svg",
    title: "View all",
    subtitle: "Invest as per your unique needs",
    eventStatus: "view all",
    id: "viewAll",
    dataAid: "viewAll",
  },
];

export const MF_INVEST_OPTIONS = [
  {
    icon: "high_growth.svg",
    title: "High growth funds",
    subtitle: "Start with as low as ₹500 ",
    eventStatus: "high growth funds",
    id: "buildwealth",
    dataAid: "highGrowthFunds",
  },
  {
    icon: "new_fund.svg",
    title: "New fund offer",
    subtitle: "Invest in newly launched funds",
    eventStatus: "new fund offer(nfo) ",
    id: "nfo",
    dataAid: "newFund",
  },
  {
    icon: "park_money.svg",
    title: "Park your savings",
    subtitle: "Make your idle money work ",
    eventStatus: "park my savings",
    id: "parkMoney",
    dataAid: "parkMySavings",
  },
  {
    icon: "tax_saving.svg",
    title: "Tax saving funds",
    subtitle: "Save tax up to ₹46,800",
    eventStatus: "save tax",
    id: "elss",
    dataAid: "taxSavingFund",
  },
  {
    icon: "invest_goal.svg",
    title: "Invest for a goal",
    subtitle: "Plans for every investment goal",
    eventStatus: "invest for a goal",
    id: "saveForGoal",
    dataAid: "goalFund",
  },
  {
    icon: "insta_redeem.svg",
    title: "Insta redemption funds",
    subtitle: "Superior return and money available 24x7",
    eventStatus: "Insta redemption funds",
    id: "instaredeem",
    dataAid: "instaRedemptionFund",
  },
];

export const EXPLORE_CATEGORIES = [
  {
    icon: `equity.svg`,
    title: "Equity",
    description: "Large, mid & small companies",
    dataAid: "equity",
  },
  {
    icon: "debt.svg",
    title: "Debt",
    description: "Stable returns with bonds & securities",
    dataAid: "debt",
  },
  {
    icon: "equity.svg",
    title: "Hybrid",
    description: "Perfect balance of equity & debt",
    dataAid: "hybrid",
  },
];

export const REFERRAL_DATA = {
  success: {
    title: "Sucessful",
    subtitle: "You have applied referral code successfully",
    primaryButtonTitle: "OKAY",
    dataAid: "referralSuccessful",
    image: require(`assets/check_circled.svg`),
  },
  failed: {
    title: "Entered incorrect code	",
    subtitle: "You have entered an incorrect referral code",
    primaryButtonTitle: "OKAY",
    dataAid: "referralError",
    image: require(`assets/caution.svg`),
  },
};

export const KYC_BOTOMSHEET_STATUS_MAPPER = {
  init: {
    title: "Are you investment ready",
    subtitle:
      "Complete KYC to invest in stocks, IPOs, F&O & primary market products",
    primaryButtonTitle: "start kyc",
    icon: "kyc_default.svg",
  },
  incomplete: {
    title: "KYC pending",
    subtitle:
      "KYC is a mandatory process to invest in stocks, primary market products, F&O",
    primaryButtonTitle: "Complete now",
    icon: "kyc_complete_setup.svg",
  },
  submitted: {
    title: "Verifying KYC",
    subtitle:
      "We’ll notify you once KYC verification is done. This may take up to 12 hours",
    primaryButtonTitle: "Continue",
    icon: "kyc_inprogress.svg",
    oneButton: true,
  },
  rejected: {
    title: "KYC rejected",
    subtitle: "Tap UPDATE KYC to re-submit the correct documents",
    primaryButtonTitle: "Update kyc",
    icon: "kyc_rejected.svg",
  },
  complete_setup: {
    title: "2 more steps to go!",
    subtitle:
      "Complete opening your Trading & Demat account to start investing in stocks, F&O & more",
    primaryButtonTitle: "Continue with Account opening",
    buttonTitle: "Continue with Account opening",
    icon: "kyc_complete_setup.svg",
    oneButton: true,
  },
  esign_ready: {
    title: "Documents verified",
    subtitle:
      "Great, just one more step to go! Now complete eSign to get investment ready",
    primaryButtonTitle: "complete esign",
    icon: "kyc_esign.svg",
    oneButton: true,
  },
  complete: {
    title: "You're ready to invest",
    subtitle:
      "Start investing in your favourite stocks, IPOs, F&O, mutual funds & more",
    primaryButtonTitle: "OKAY",
    icon: "kyc_esign.svg",
    oneButton: true,
  },
  mf_complete: {
    title: "You're investment ready",
    subtitle: "You can now invest in more than 5000+ mutual funds.",
    primaryButtonTitle: "OKAY",
    icon: "kyc_esign.svg",
    oneButton: true,
  },
  verifying_trading_account: {
    title: "Trading and Demat account set up in progress",
    subtitle: "This could take up to 12 hours. We’ll notify you once done",
    primaryButtonTitle: "Continue",
    icon: "kyc_inprogress.svg",
    oneButton: true,
  },
  fno_rejected: {
    title: "Income proof rejected",
    subtitle:
      "F&O application was not processed due to wrong income proof. Please upload the correct document to proceed",
    primaryButtonTitle: "update document",
    secondaryButtonTitle: "later",
    icon: "kyc_rejected.svg",
  },
  upgrade_incomplete: {
    title: "Upgrade to trading and demat account",
    subtitle: "Invest in India's top companies in just a few taps",
    primaryButtonTitle: "upgrade now",
    icon: "kyc_upgrade.svg",
  },
};

export const BOTTOMSHEET_KEYS = {
  openKyc: "openKyc",
  openCampaign: "openCampaign",
  openReferral: "openReferral",
  openAuthVerification: "openAuthVerification",
  openAccountAlreadyExists: "openAccountAlreadyExists",
  openPremiumOnboarding: "openPremiumOnboarding",
};

export const AUTH_VERIFICATION_DATA = {
  icon: "account_already_exists.svg",
  email: {
    title: "Verify your email address",
    subtitle: "Email verification is mandatory for investment as per SEBI",
    primaryButtonTitle: "Continue",
    authValue: "alek@yopmail.com",
    dataAid: "emailAddress",
  },
  mobile: {
    icon: "mobile_verification.svg",
    title: "Verify your mobile number",
    subtitle: "Mobile verification is mandatory for investment as per SEBI",
    primaryButtonTitle: "Continue",
    authValue: "9087217311",
    dataAid: "mobileNumber",
  },
  accountExists: {
    showAuthExists: true,
    icon: "account_already_exists.svg",
    title: "Account already exists!",
    subtitle: "Mobile verification is mandatory for investment as per SEBI",
    primaryButtonTitle: "Continue",
    dataAid: "verification",
    authValue: "9087217311",
    authType: "Email",
    pan: "CXIPP****M",
  },
};

export const PREMIUM_ONBORDING_MAPPER = {
  ground_premium: {
    title: `Premium Onboarding`,
    subtitle: `Congratulations! You have been selected for premium onboarding. Fast track your investment journey.`,
    primaryButtonTitle: "CONTINUE",
    oneButton: true,
    icon: "premium.svg",
    instant: true,
  },
  incomplete: {
    title: `Premium Onboarding`,
    subtitle: `Fast track your investment with premium onboarding`,
    primaryButtonTitle: "complete now",
    secondaryButtonTitle: "Not now",
    icon: "premium.svg",
  },
};
