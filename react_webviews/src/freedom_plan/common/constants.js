import { inrFormatDecimal } from "../../utils/validators";

export const getPlanReviewData = ({ amount, gstAmount, totalAmount }) => () => {
  return [
    {
      title: "Freedom plan",
      amount: inrFormatDecimal(amount, 2),
      amountClassName: "fprs-amount",
    },
    {
      title: "GST (18%)",
      amount: inrFormatDecimal(gstAmount, 2),
      amountClassName: "fprs-amount",
    },
    {
      title: "Amount payable",
      amount: inrFormatDecimal(totalAmount, 2),
      amountClassName: "fprs-text fprs-total-amount",
      titleClassName: "fprs-text",
      showTopDivider: true,
    },
  ];
};
