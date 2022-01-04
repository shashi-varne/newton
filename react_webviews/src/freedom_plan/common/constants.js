import { inrFormatDecimal } from "../../utils/validators";

export const getPaymentSummaryData = ({ amount, gstAmount, totalAmount }) => () => {
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
