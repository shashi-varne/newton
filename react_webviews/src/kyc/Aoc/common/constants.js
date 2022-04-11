import { formatAmountInr, inrFormatDecimal } from "../../../utils/validators";

export const PAYMENT_SUMMARY_DATA = {
  upgrade: {
    title: "Upgrading to trading and demat account",
    subtitle: "Stocks, IPOs, NCDs, SGBs",
    buttonTitle: "Continue to Pay",
  },
  default: {
    title: "Trading & Demat + Mutual Fund account",
    subtitle: "Stocks, Mutual funds, IPOs, NCDs, SGBs",
    buttonTitle: "PAY NOW",
  },
};

export const PAYMENT_STATUS_DATA = {
  success: {
    title: "Payment successful",
    subtitle:
      "Last step remaining! Now eSign to complete opening your Trading & Demat + Mutual Fund account",
    buttonTitle: "Continue",
    icon: "eq_pg_success.svg",
    screenName: "payment_success",
    isSuccess: true,
    id: "success",
  },
  failed: {
    title: "Payment failed",
    subtitle:
      "Any money debited will be refunded back to your account in 5-7 working days",
    buttonTitle: "RETRY",
    icon: "error_illustration.svg",
    screenName: "payment_failed",
    isSuccess: false,
    id: "fail",
  },
};

export const getAocPaymentStatusData = ({ amount, gst, totalAmount }) => {
  return {
    title: "Payment details",
    data: [
      {
        title: "Amount",
        amount: inrFormatDecimal(amount, 2),
        dataAid: "price",
      },
      {
        title: "GST",
        amount: inrFormatDecimal(gst, 2),
        dataAid: "gst",
        showDivider: true,
        className: "aoc-ps-gst",
      },
      {
        title: "Total",
        amount: inrFormatDecimal(totalAmount, 2),
        className: "aoc-total-amount",
        showDivider: true,
        dataAid: "totalAmount",
      },
    ],
  };
};

export const AOC_STORAGE_CONSTANTS = {
  AOC_PAYMENT_DATA: "aocPaymentData",
};

export const getAocPaymentSummaryData = ({ amount, gst, totalAmount, gstPercentage }) => {
  return {
    title: "Payment details",
    data: [
      {
        title: "Account opening fees",
        amount: inrFormatDecimal(amount, 2),
        dataAid: "price",
      },
      {
        title: `GST (${gstPercentage}%)`,
        amount: inrFormatDecimal(gst, 2),
        dataAid: "gst",
        showDivider: true,
        className: "aoc-ps-gst",
      },
      {
        title: "Amount payable",
        amount: inrFormatDecimal(totalAmount, 2),
        showDivider: true,
        dataAid: "totalAmount",
        className: "aoc-ps-total",
      },
    ],
  };
};

export const ACCOUNT_TYPES = [
  {
    value: "trading",
    eventValue: "mf_and_trading",
    icon: "aoc_trading",
    showRadioIconWithImage: true,
    title: "Trading & Demat + Mutual Fund  ",
    subtitleList: ["Stocks", "IPO", "Mutual funds"],
    keyPoints: [
      {
        title: "Single KYC for all investments",
        icon: "star_large",
      },
      {
        title: "Affordable brokerage & fees",
        clickableText: "See charges",
        icon: "star_large",
      },
    ],
    bottomContent: {
      title: "One-time account opening fee",
      isRecommended: true,
    },
  },
  {
    value: "mf",
    eventValue: "only_mf",
    showRadioIconWithTitle: true,
    title: "Mutual Fund only ",
    keyPoints: [
      {
        title: "Invest in 5,000 + mutual funds",
        icon: "star_silver",
      },
      {
        title: "No account opening fees",
        icon: "star_silver",
      },
    ],
  },
];

export const getMfVsTradingData = (amount, isFree) => () => {
  return [
    {
      type: "PRODUCTS",
      mf: "MUTUAL FUND ONLY",
      trading: "TRADING & DEMAT + MF",
    },
    {
      type: "Stocks",
      mfIcon: "cross",
      tradingIcon: `check`,
    },
    {
      type: "IPOs",
      mfIcon: "cross",
      tradingIcon: `check`,
    },
    {
      type: "Futures & options",
      mfIcon: "cross",
      tradingIcon: `check`,
    },
    {
      type: "Mutual funds",
      mfIcon: "check",
      tradingIcon: `check`,
      className: "mfvt-mf",
    },
    {
      type: "Bonds",
      mfIcon: "cross",
      tradingIcon: `check`,
    },
    {
      type: "Debentures & more",
      mfIcon: "cross",
      tradingIcon: `check`,
      className: "mfvt-bottom-content",
    },
    {
      type: "FEATURES",
      mf: "",
      trading: "",
      showTopBorder: true,
      className: "mfvt-features",
    },
    {
      type: "Exclusive stock reports",
      mfIcon: "cross",
      tradingIcon: `check`,
    },
    {
      type: "Multi channel support",
      subText: "(App, Web, Call & trade)",
      mfIcon: "cross",
      tradingIcon: `check`,
    },
    {
      type: "Real-time portfolio tracking",
      mfIcon: "cross",
      tradingIcon: `check`,
      className: "mfvt-bottom-content",
    },
    {
      type: "Account opening charges",
      showTopBorder: true,
      mf: "No charges",
      amount: `${formatAmountInr(amount)}/-`,
      trading: `${isFree ? "Free" : "(One-time)"}`,
      className: `mfvt-aoc-summary ${isFree && "mfvt-noaoc-summary"}`,
      strikeOut: isFree,
    },
  ];
};
