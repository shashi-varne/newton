import React from "react";
import { getConfig } from "../../../utils/functions";
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

const SelfieUploadStatus = ({ status, isOpen, onClose, onCtaClick }) => {
  const data = uploadStatus[status] || {};
  
  if (!status) return '';

  return (
    <WVBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={data.title}
      subtitle={data.subtitle}
      image={data.icon && require(`assets/${productName}/${data.icon}`)}
      button1Props={{
        title: data.ctaText,
        type: 'primary',
        onClick: onCtaClick,
      }}
    />
  );
};

export default SelfieUploadStatus;
