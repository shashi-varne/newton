export const KYC_CARD_STATUS_MAPPER = {
  init: {
    title: "Are you investment ready?",
    subtitle: "Check your KYC status",
    buttonTitle: "Check now",
    icon: "kyc_default.svg",
  },
  incomplete: {
    title: "Complete your KYC",
    subtitle: "Just a few more steps to go",
    buttonTitle: "Complete now",
    icon: "kyc_default.svg",
  },
  submitted: {
    title: "KYC application submitted",
    subtitle: "In progress",
    buttonTitle: "track status",
    icon: "kyc_inprogress.svg",
    descriptionColor: "foundationColors.secondary.coralOrange.400",
  },
  rejected: {
    title: "KYC application rejected",
    subtitle: "Your documents couldn’t be verified",
    buttonTitle: "review & Modify",
    icon: "kyc_rejected.svg",
    descriptionColor: "foundationColors.secondary.lossRed.400",
  },
  complete_setup: {
    title: "Complete account set up",
    subtitle: "Only a few steps remaining",
    buttonTitle: "Continue ",
    icon: "kyc_complete_setup.svg",
  },
  esign_ready: {
    title: "KYC documents verified",
    subtitle: "Now eSign to complete application",
    buttonTitle: "eSIGN now",
    icon: "kyc_esign.svg",
  },
  verifying_trading_account: {
    title: "You’re ready to invest in mutual funds",
    subtitle: "Trading account set up in progress",
    buttonTitle: "track status",
    icon: "kyc_inprogress.svg",
    descriptionColor: "foundationColors.secondary.coralOrange.400",
  },
  fno_rejected: {
    title: "F&O verification failed",
    subtitle: "We’re unable to verify the documents submitted to activate F&O",
    buttonTitle: "review & Modify",
    icon: "kyc_rejected.svg",
    descriptionColor: "foundationColors.secondary.lossRed.400",
  },
  upgrade_incomplete: {
    title: "Upgrade to Trading & Demat account",
    subtitle: "STOCKS | IPO | F&O",
    buttonTitle: "Continue ",
    descriptionColor: "foundationColors.secondary.profitGreen.400",
    icon: "kyc_upgrade.svg",
  },
};

export const ONBOARDING_CAROUSALS = [
  {
    icon: "invest_with_confidence.svg",
    iconDataAid: "investWithConfidence",
    title: "Invest with confidence",
    subtitle: "Trusted by your bank & loved by millions of investors",
  },
  {
    icon: "one_investment_account.svg",
    title: "One investment account",
    iconDataAid: "oneInvestmentAccount",
    subtitle: "For Stocks, IPO, F&O, Mutual Funds, NPS & more",
  },
  {
    icon: "withdraw_funds.svg",
    iconDataAid: "withdrawFunds",
    title: "Withdraw funds anytime, anywhere",
    subtitle: "Get cash in your savings account when you need it the most",
  },
];

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
  },
  {
    icon: `freedomplan.svg`,
  },
  {
    icon: `freedomplan.svg`,
  },
  {
    icon: `freedomplan.svg`,
  },
];

export const INVESTMENT_OPTIONS = [
  {
    icon: "stocks.svg",
    title: "Stocks, F&O",
    subtitle: "Invest in your favourite companies",
    dataAid: "stocks",
  },
  {
    icon: "ipo.svg",
    title: "IPOs",
    subtitle: "Invest in primary market products",
    dataAid: "ipoSgbNcd",
  },
  {
    icon: "mf.svg",
    title: "Mutual funds",
    subtitle: "Top performing funds for your goals",
    dataAid: "mutualFunds",
  },
  {
    icon: "nps.svg",
    title: "National pension scheme",
    subtitle: "Invest today for a secure retirement",
    dataAid: "nps",
  },
  {
    icon: "io_insurance.svg",
    title: "Insurance",
    subtitle: "Build a safety net for your future",
    dataAid: "insurance",
  },
  {
    icon: "tax_filing.svg",
    title: "Free tax filing",
    subtitle: "Save and file your ITRs fast",
    dataAid: "taxFiling",
  },
];

export const MF_INVESTMENT_OPTIONS = [
  {
    icon: "high_growth.svg",
    title: "High growth funds",
    subtitle: "Start with as low as ₹500 ",
    dataAid: "highGrowthFunds",
  },
  {
    icon: "new_fund.svg",
    title: "New fund offer",
    subtitle: "Invest in newly launched funds",
    dataAid: "newFund",
  },
  {
    icon: "park_money.svg",
    title: "Park your savings",
    subtitle: "Make your idle money work ",
    dataAid: "parkMySavings",
  },
  {
    icon: "view_all.svg",
    title: "View all",
    subtitle: "Invest as per your unique needs",
    dataAid: "viewAll",
  },
];

export const INVESTER_FAVOURITES = [
  {
    icon: "high_growth.svg",
    title: "High growth funds",
    subtitle: "Start with as low as ₹500 ",
    dataAid: "highGrowthFunds",
  },
  {
    icon: "new_fund.svg",
    title: "New fund offer",
    subtitle: "Invest in newly launched funds",
    dataAid: "newFund",
  },
  {
    icon: "park_money.svg",
    title: "Park your savings",
    subtitle: "Make your idle money work ",
    dataAid: "parkMySavings",
  },
  {
    icon: "tax_saving.svg",
    title: "Tax saving funds",
    subtitle: "Save tax up to ₹46,800",
    dataAid: "taxSavingFund",
  },
  {
    icon: "invest_goal.svg",
    title: "Invest for a goal",
    subtitle: "Plans for every investment goal",
    dataAid: "goalFund",
  },
  {
    icon: "insta_redeem.svg",
    title: "Insta redemption funds",
    subtitle: "Superior return and money available 24x7",
    dataAid: "instaRedemptionFund",
  },
];

export const EASY_SIP_DATA = {
  icon: "assets/easy_sip.svg",
  title: "Set up easySIP",
  subtitle: "Authorise one-time eMandate to automate your upcoming SIPs",
  dataAid: "easySip",
};

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
