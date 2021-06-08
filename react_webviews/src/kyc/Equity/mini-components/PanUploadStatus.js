import React from "react";
import { getConfig, isTradingEnabled } from "../../../utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";

const productName = getConfig().productName;
const uploadStatus = {
  success: {
    icon: "ic_indian_resident.svg",
    title: "PAN uploaded",
    subtitle: "You're almost there, now take a selfie",
    ctaText: "CONTINUE",
  },
  failed: {
    icon: "pan_verification_failed.svg",
    title: "PAN verification failed",
    subtitle: "PAN number doesn't match with the uploaded PAN image",
    ctaText: "RETRY",
  },
};

const PanUploadStatus = ({ status, isOpen, kyc, onClose, disableBackdropClick, onCtaClick }) => {
  if (!status) return '';

  const data = uploadStatus[status] || {};
  const TRADING_ENABLED = isTradingEnabled(kyc);
  
  if (status === "success") {
    data.subtitle = !TRADING_ENABLED
      ? "Great, just one more step to go! Now complete eSign to get investment ready"
      : kyc?.all_dl_doc_statuses?.pan_fetch_status === "failed"
      ? "You’re almost there, now give details for your trading account"
      : "You're almost there, now take a selfie";
  }

  return (
    <WVBottomSheet
      isOpen={isOpen}
      title={data.title}
      subtitle={data.subtitle}
      image={data.icon && require(`assets/${productName}/${data.icon}`)}
      button1Props={{
        title: data.ctaText,
        type: 'primary',
        onClick: onCtaClick,
      }}
      disableBackdropClick
    />
  );
};

export default PanUploadStatus;
