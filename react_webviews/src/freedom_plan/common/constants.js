import { inrFormatDecimal } from "../../utils/validators";

export const getPaymentSummaryData = ({
  amount,
  gstAmount,
  totalAmount,
}) => () => {
  return [
    {
      title: "Price",
      amount: inrFormatDecimal(amount, 2),
    },
    {
      title: "GST",
      amount: inrFormatDecimal(gstAmount, 2),
      showBottomDivider: true,
    },
    {
      title: "Total",
      amount: inrFormatDecimal(totalAmount, 2),
      className: "fpps-total-amount",
      showBottomDivider: true,
    },
  ];
};

export const PAYMENT_STATUS_DATA = {
  success: {
    title: "Payment successful",
    subtitle:
      "Your freedom plan will be activated in 24 hours. Till then, standard brokerage shall apply",
    buttonTitle: "OKAY",
    icon: "pg_success.svg",
    screenName: "payment_success",
    isSuccess: true,
  },
  failed: {
    title: "Payment failed",
    subtitle:
      "Any money debited will be refunded back to your account in 5-7 working days",
    buttonTitle: "RETRY",
    icon: "error_illustration.svg",
    screenName: "payment_failed",
    isSuccess: false,
  },
};
