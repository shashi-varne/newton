export const apiConstants = {
  reportSummaryV2:
    "/api/invest/reportv4/portfolio/summary/v2?upcoming_needed=y",
  reportGoals: "/api/invest/reportv4/portfolio/summary?upcoming_needed=y",
  getFunds: "/api/invest/reportv4/portfolio/funds",
  getFundMf: "/api/mf/v2",
  getFundDetailsForSwitch: "/api/invest/reportv4/portfolio/fund-detail",
  getTransactions: "/api/invest/transactionv4",
  getFundsWiseTransactions: "/api/invest/transactionv4",
  getAvailableFundsForSwitch: "/api/invest/fund/switch/available-funds",
  postSwitchRecommendation: "/api/invest/switch/orders",
  getSipAction: "/api/invest/sip/",
};

export const getPathname = {
  reports: "/reports",
  invest: "/invest",
  investMore: "/reports/invest/",
  diyFundInfo: "/diy/fundinfo",
  buildwealth: "/invest/buildwealth",
  savetax: "/invest/savetax",
  investsurplus: "/invest/parkmoney",
  saveforgoal: "/invest/savegoal",
  diy: "/invest/explore",
  "insta-redeem": "/invest/instaredeem",
  npsInvestments: "/nps/investments",
  withdraw: "/withdraw",
  withdrawReason: "/withdraw/reason",
  reportGoals: "/reports/goals",
  reportsPurchased: "/reports/purchased-transaction",
  reportsRedeemed: "/reports/redeemed-transaction",
  reportsSwitched: "/reports/switched-transaction",
  reportsSip: "/reports/sip",
  reportsTransactions: "/reports/transactions",
  reportsFundswiseSummary: "/reports/fundswise/summary",
  reportsFunds: "/reports/goals/funds/",
  reportsFundswiseSwitch: "/reports/fundswise/switch/",
  reportsFundswiseTransactions: "/reports/transactions/",
  reportsFundswiseDetails: "/reports/fundswise/details/",
  reportsSwitchNow: "/reports/fundswise/switch-now/",
  otpSwitch: "/withdraw/switch/verify",
  sipDetails: "/reports/sip/details",
  pauseAction: "/reports/sip/pause-action/",
  pauseResumeRestart: "/reports/sip/pause-resume-restart/",
  pauseCancelDetail: "/reports/sip/pause-cancel-detail/",
  pausePeriod: "/reports/sip/pause-period",
  sipOtp: "/reports/sip/otp/",
  pauseRequest: "/reports/sip/pause-request",
};

export const storageConstants = {
  USER: "user",
  KYC: "kyc",
  PENDING_PURCHASE: "pending_purchase",
  PENDING_REDEMPTION: "pending_redemption",
  PENDING_SWITCH: "pending_switch",
  SIPS: "sips",
  DIYSTORE_FUNDINFO: "diystore_fundInfo",
  REPORTS_SWITCH_FUND_TO: "reports_switch_fund_to",
  PAUSE_SIP: "pause-sip",
  SELECTED_SIP: "selected-sip",
  PAUSE_REQUEST_DATA: "pause-request-data",
  MF_INVEST_DATA: "mf_invest_data",
  REPORTS_SELECTED_FUND: "reports_selected_fund",
};

export const getPurchaseProcessData = (
  dt_created = "",
  expected_credit_date = "",
  nfo_recommendation = false
) => {
  return {
    purchase: [
      {
        title: "Payment successful",
        desc: "",
        time: "Immediate",
      },
      {
        title: "Order placed",
        desc:
          "The payment and investment details are sent to the mutual fund company for order execution.",
        time: "1 day",
      },
      {
        title: "Units allotted",
        desc:
          "On successful order execution units are allotted. Your investment will be active from this day onward.",
        time: nfo_recommendation ? "10-15 days" : "1 day",
      },
      {
        title: "Investment confirmed",
        desc:
          "fisdom has received confirmation of the investment from the mutual fund company and your portfolio is updated.",
        time: "2-3 days",
      },
    ],
    withdraw: [
      {
        title: "Withdraw requested",
        desc: "",
        time: dt_created,
      },
      {
        title: "Order placed",
        desc: "Order sent to fund house.",
        time: "1 day",
      },
      {
        title: "Units deducted",
        desc: "Order executed and units deducted.",
        time: "2-3 days",
      },
      {
        title: "Amount credited",
        desc:
          "fisdom has received confirmation of the withdrawal from the mutual fund company.",
        time: expected_credit_date,
      },
    ],
    switch: [
      {
        title: "Switch requested",
        desc: "",
        time: "Immediate",
      },
      {
        title: "Order placed",
        desc:
          "Your order has been sent to the mutual fund company for execution",
        time: "1 day*",
      },
      {
        title: "Units switched",
        desc: "On succesful order execution, units are switched",
        time: "2-3 days*",
      },
      {
        title: "Switch confirmed",
        desc:
          "fisdom has received confirmation of the switch from the mutual fund company.",
        time: "3-6 days*",
      },
    ],
    autodebit: [
      {
        title: "Auto debit request raised",
        desc:
          "Auto debit of the SIP amount from your bank account is initiated and the order has been placed. Allotment of units is subject to successful auto-debit.",
        time: "Immediate",
      },
      {
        title: "Units allotted",
        desc:
          "On successful order execution, units are allotted. Your investment will be active from this day onward.",
        time: "1 day",
      },
      {
        title: "Investment confirmed",
        desc:
          "fisdom has received confirmation of the investment from the mutual fund company and your portfolio is updated.",
        time: "2-3 days",
      },
    ],
  };
};
