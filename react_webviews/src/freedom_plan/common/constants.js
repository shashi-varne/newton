import { PATHNAME_MAPPER as KYC_PATHNAME_MAPPER } from "../../kyc/constants";
import { inrFormatDecimal } from "../../utils/validators";

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
