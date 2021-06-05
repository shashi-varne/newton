import React from "react";
import { getConfig, isTradingEnabled } from "../../../utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import { storageService } from "../../../utils/validators";

const productName = getConfig().productName;
const TRADING_ENABLED = isTradingEnabled();
const kyc = storageService().getObject("kyc");
const uploadStatus = {
  success: {
    icon: "ic_indian_resident.svg",
    title: "PAN uploaded",
    subtitle: !TRADING_ENABLED || kyc?.all_dl_doc_statuses?.pan_fetch_status === "failed" ? 
      "Great, just one more step to go! Now complete eSign to get investment ready" : "You're almost there, now take a selfie",
    ctaText: "CONTINUE",
  },
  failed: {
    icon: "pan_verification_failed.svg",
    title: "PAN verification failed",
    subtitle: "PAN number doesn't match with the uploaded PAN image",
    ctaText: "RETRY",
  },
};

const PanUploadStatus = ({ status, isOpen, onClose, disableBackdropClick, onCtaClick }) => {
  const data = uploadStatus[status] || {};
  
  if (!status) return '';

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
