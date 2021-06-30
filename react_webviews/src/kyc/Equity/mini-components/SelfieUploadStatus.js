import React from "react";
import { getConfig, isTradingEnabled } from "../../../utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";

const productName = getConfig().productName;
const uploadStatus = {
  success: {
    icon: "upload_success.svg",
    title: "Selfie uploaded",
    subtitle:
      "you're nearly done! Provide income proof in the next step if you want to opt for F&O trading",
    ctaText: "CONTINUE",
  },
  failed: {
    icon: "upload_error.svg",
    title: "Selfie upload failed",
    subtitle: "Selfie doesn't match the picture as displayed on your ID proof ",
    ctaText: "RETRY",
  },
};

const SelfieUploadStatus = ({ status, isOpen, onClose, onCtaClick, kyc }) => {
  if (!status) return '';
  
  const data = uploadStatus[status] || {};
  const TRADING_ENABLED = isTradingEnabled(kyc);
  if (status === "success") {
    if (!TRADING_ENABLED || (kyc?.kyc_status === "non-compliant" && kyc?.kyc_type === "manual")) {
      data.subtitle = "Great, now continue to provide other documents to complete KYC"
    }
  }
  

  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={data.title}
      subtitle={data.subtitle}
      image={data.icon && require(`assets/${productName}/${data.icon}`)}
      button1Props={{
        title: data.ctaText,
        variant: "contained",
        onClick: onCtaClick,
      }}
      disableBackdropClick
    />
  );
};

export default SelfieUploadStatus;
