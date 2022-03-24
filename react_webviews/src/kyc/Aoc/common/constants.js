import { inrFormatDecimal } from "../../../utils/validators";

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
        title: "Single KYC for all investments",
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
