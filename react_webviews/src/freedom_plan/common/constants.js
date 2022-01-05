import { formatAmountInr, inrFormatDecimal } from "../../utils/validators";
import { PATHNAME_MAPPER as KYC_PATHNAME_MAPPER } from "../../kyc/constants";

export const MINIMUM_FREEDOM_PLAN_PRICE = 2499;

export const PATHNAME_MAPPER = {
  landing: '/freedom-plan',
  review: '/freedom-plan/review',
  paymentStatus: '/freedom-plan/payment/status',
}

export const FREEDOM_PLAN_BENEFITS_DATA = {
  title: "One plan, Unlimited benefits",
  options: [
    {
      img: require("assets/ic_zero_brokerage.svg"),
      title: `Pay only the subscription fee & enjoy ₹0 brokerage `,
    },
    {
      img: require("assets/ic_trade_unlimited.svg"),
      title: `Trade unlimited in Intraday, Delivery, F&O, Currency Derivatives`,
    },
    {
      img: require("assets/ic_dealer_support.svg"),
      title: `Get dedicated dealer support & access to super trade terminal`,
    },
  ],
};

export const getStandardVsFreedomPlanDetails = (
  equityChargesData = {}
) => () => {
  return [
    {
      type: "Brokerage type",
      standardPlan: "Standard plan",
      standardPlanSubtext: "Current plan",
      freedomPlan: "Freedom Plan",
    },
    {
      type: "Delivery",
      standardPlan: `${formatAmountInr(
        equityChargesData.brokerage_delivery?.rupees
      )}/-`,
      standardPlanSubtext: "on transaction value",
      freedomPlan: " ₹0/-",
    },
    {
      type: "Intraday",
      standardPlan: ` ${formatAmountInr(
        equityChargesData.brokerage_intraday?.rupees
      )}/-`,
      standardPlanSubtext: "on transaction value",
      freedomPlan: " ₹0/-",
    },
    {
      type: "Futures",
      standardPlan: ` ${formatAmountInr(
        equityChargesData.brokerage_future?.rupees
      )} per lot`,
      standardPlanSubtext: "on executed order",
      freedomPlan: " ₹0/-",
    },
    {
      type: "Options",
      standardPlan: ` ${formatAmountInr(
        equityChargesData.brokerage_options?.rupees
      )} per lot`,
      standardPlanSubtext: "on executed order",
      freedomPlan: " ₹0/-",
    },
  ];
};

export const getFreedomPlanFaqs = (productName) => () => {
  return [
    {
      title: `What is the Freedom plan?`,
      subtitle: `The Freedom plan is a zero brokerage, unlimited trading plan that allows you to place an infinite number of trades by volume or size. By paying a one-time subscription fee, you can enjoy zero brokerages on all your trades for a specified period. Freedom plan is available for three different validity periods (2 months, 6 months & 1 year). You can select plans based on your needs.`,
    },
    {
      title: `Will I be charged zero brokerages on all trades?`,
      subtitle: `Yes. However, statutory and regulatory charges such as STT (Securities Transaction Tax) & stamp charges will be levied on your trades. Please note, these charges are mandated by the regulatory bodies and not by ${productName}.`,
    },
    {
      title: `What happens when my Freedom plan expires?`,
      subtitle: `You can choose to renew your freedom plan once the validity of your subscription ends. You can do so from the 'Brokerage Plan' section of your account on the App. In case you decide not to renew the plan, the standard brokerage rates (flat ₹20 per order in all segments - Equity Intraday/Delivery, Futures & Options, Currency Futures & Options) will apply.`,
    },
    {
      title: `What other benefits can I get from my Freedom plan?`,
      subtitle: `Freedom plan offers you a host of benefits. Apart from enjoying 0 brokerages on all trades, you also get premium access to the Super Trade Terminal & dedicated Dealer Support. `,
    },
    {
      title: `Is the Freedom plan applicable on trades in all segments?`,
      subtitle: `Yes. As a Freedom plan subscriber, you will pay 0 brokerages on all your trades, across all segments.`,
    },
    {
      title: `Are there any limits on the number of trades/turnover, etc.?`,
      subtitle: `No. The Freedom plan offers truly unlimited trading with no limits on volume, turnover and number of trades.`,
    },
    {
      title: `How long does it take for my plan to get activated after payment?`,
      subtitle: `It can take up to 24 hours for your Freedom plan to get activated after your payment is successfully received by us.`,
    },
    {
      title: `How to track the validity of my Freedom plan?`,
      subtitle: `Once your plan is active, you can head over to the ‘Brokerage Plan’ section under ‘Account’ on your ${productName} app to track the validity of your Freedom plan.`,
    },
    {
      title: `How to cancel my subscription plan?`,
      subtitle: `At present, we do not support/allow plan cancellation post activation of your Freedom plan.`,
    },
  ];
};

export const KYC_STATUS_MAPPER = {
  init: {
    title: "Open Trading & Demat account",
    subtitle:
      "To opt for the Freedom plan you must have an active Trading & Demat account",
    icon: "icn_kyc_incomplete.svg",
    buttonTitle: "Open now",
    nextState: KYC_PATHNAME_MAPPER.homeKyc,
  },
  incomplete: {
    title: "Trading & Demat A/c set up not complete",
    subtitle:
      "To opt for the Freedom plan you must have an active Trading & Demat account",
    icon: "icn_kyc_incomplete.svg",
    buttonTitle: "Complete SET UP",
    nextState: KYC_PATHNAME_MAPPER.journey,
  },
  in_progress: {
    title: "Account opening is in progress",
    subtitle:
      "You can proceed to buy Freedom plan once your Trading & Demat is set up",
    icon: "icn_kyc_doc_verification.svg",
    buttonTitle: "Check back later",
  },
  rejected: {
    title: "Trading & Demat A/c on hold ",
    subtitle:
      "Documents submitted for account opening is rejected. Please re-submit documents to proceed",
    icon: "icn_kyc_doc_rejected.svg",
    buttonTitle: "Submit now",
    nextState: KYC_PATHNAME_MAPPER.uploadProgress,
  },
  esign_pending: {
    title: "eSign pending",
    subtitle: "Complete eSign to get started with your Freedom plan",
    icon: "icn_kyc_completed.svg",
    buttonTitle: "esign NOW",
    nextState: KYC_PATHNAME_MAPPER.kycEsign,
  },
};

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
      showBottomDivider: true,
    },
    {
      title: "Amount payable",
      amount: inrFormatDecimal(totalAmount, 2),
      amountClassName: "fprs-text fprs-total-amount",
      titleClassName: "fprs-text",
    },
  ];
};

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

export const FREEDOM_PLANS = [
  {
    value: 2,
    amount: 2499,
    name: "2 MONTHS",
    isPopular: false,
  },
  {
    value: 6,
    amount: 5999,
    name: "6 MONTHS",
    isPopular: false,
  },
  {
    value: 12,
    amount: 9999,
    name: "1 YEAR",
    isPopular: true,
  },
];

export const getFreedomPlanTermsAndConditions = (websiteLink) => () => {
  return [
    `Freedom Plan subscription is applicable only to Resident individuals. `,
    `*GST@ 18% would be applicable on the subscription amount of Freedom plan. `,
    `The Subscription amount transferred to avail the plan would not be available for further transaction in any segment. `,
    `The amount paid for the Freedom Plan will be available only for transactions in the Equity Cash products and Equity Derivatives products and Currency Derivatives products. The subscription plan will not be applicable on transactions in any other products like Mutual Funds, Life Insurance, General Insurance, FD etc. `,
    `The balance of your subscription payment is non-transferable and non-refundable. `,
    `Post completion of the validity of the plan you have selected, standard brokerage slabs will apply. `,
    `In order to opt for the Freedom plan, the customer would require to transfer the applicable scheme amount to the mentioned bank account, pay through the link or alternately the customer may submit a cheque favouring “Finwizard Technologies Pvt. Ltd.” `,
    `In case of cheques, the plan will be activated only after receipt of payment in our bank account. `,
    `On realisation of the subscription amount, the plan will be activated within 24 hours. `,
    `The customer will be charged ₹0.01 for every segment per contract that he trades in – equity & derivatives. `,
    `Demat charges, Demat AMC and other statutory charges including exchange fees and other applicable taxes and charges will have to be borne by the customer. `,
    `Finwizard Technology Pvt. Ltd reserves the right to modify/discontinue any of the above conditions after giving prior notice of the same to customers electronically. `,
    `For further information please visit ${websiteLink}`,
  ];
};
