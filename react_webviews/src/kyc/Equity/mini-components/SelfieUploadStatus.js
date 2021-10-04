import React, { useMemo } from "react";
import { getConfig, isNewIframeDesktopLayout, isTradingEnabled } from "../../../utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import internalStorage from "../../common/InternalStorage";

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

const SelfieUploadStatus = ({ status, isOpen, onClose, onCtaClick, kyc, navigate }) => {
  if (!status) return '';
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);

  const data = uploadStatus[status] || {};
  const TRADING_ENABLED = isTradingEnabled(kyc);
  if (status === "success") {
    if (!TRADING_ENABLED || (kyc?.kyc_status === "non-compliant" && kyc?.kyc_type === "manual" && !kyc?.equity_data.meta_data.trading_experience)) {
      data.subtitle = ""
    }
  }

  if(isNewIframeDesktopLayout()) {
    const stateParams = {
      title: data.title,
      buttonTitle: data.ctaText,
      message: data.subtitle,
      image: data.icon
    }
    internalStorage.setData('handleClick', onCtaClick);
    navigate('/kyc/selfie-status',{state:{...stateParams}});
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
