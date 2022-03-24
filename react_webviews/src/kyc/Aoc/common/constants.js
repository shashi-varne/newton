import { formatAmountInr, inrFormatDecimal } from "../../../utils/validators";

export const PAYMENT_STATUS_DATA = {
  success: {
    title: "Payment is successful",
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

export const getAocPaymentStatusData = ({ amount, gst, total_amount }) => {
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
        amount: inrFormatDecimal(total_amount, 2),
        className: "aoc-total-amount",
        showDivider: true,
        dataAid: "totalAmount",
      },
    ],
  };
};

export const AOC_STORAGE_CONSTANTS = {
  AOC_DATA: "aocData",
};

export const getAocPaymentSummaryData = ({ amount, gst, total_amount }) => {
  return {
    title: "Payment details",
    data: [
      {
        title: "Account opening fees",
        amount: inrFormatDecimal(amount, 2),
        dataAid: "price",
      },
      {
        title: "GST (18%)",
        amount: inrFormatDecimal(gst, 2),
        dataAid: "gst",
        showDivider: true,
        className: "aoc-ps-gst",
      },
      {
        title: "Amount payable",
        amount: inrFormatDecimal(total_amount, 2),
        showDivider: true,
        dataAid: "totalAmount",
        className: "aoc-ps-total",
      },
    ],
  };
};

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
