import { formatAmountInr } from "../../utils/validators";
import { inrFormatDecimal } from "../../utils/validators";

export const MINIMUM_FREEDOM_PLAN_PRICE = 2499;

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
