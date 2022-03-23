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

export const getAocPaymentSummaryData = ({ amount, gst, total_amount }) => {
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
        className: "aoc-ps-gst"
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
