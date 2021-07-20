import React from "react";
import { getConfig, isNewIframeDesktopLayout, isTradingEnabled } from "../../../utils/functions";
import WVBottomSheet from "../../../common/ui/BottomSheet/WVBottomSheet";
import internalStorage from "../../common/InternalStorage";

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

const PanUploadStatus = ({ status, isOpen, kyc, onClose, disableBackdropClick, onCtaClick, navigate }) => {
  if (!status) return '';

  const data = uploadStatus[status] || {};
  const TRADING_ENABLED = isTradingEnabled(kyc);
  
  if (status === "success") {
    const notManualAndNotNriCondition = (!kyc?.address?.meta_data?.is_nri && kyc?.kyc_type !== "manual")
    ? "Great, just one more step to go! Now complete eSign to get investment ready"
    : "Great, now continue to provide other documents to complete KYC"
    
    data.subtitle = !TRADING_ENABLED
      ? notManualAndNotNriCondition
      : (kyc?.all_dl_doc_statuses?.pan_fetch_status === "failed" && !kyc.equity_data.meta_data.trading_experience)
      ? "You’re almost there, now give details for your trading account"
      : kyc?.kyc_type === "manual" 
      ? "Great, now continue to provide other documents to complete KYC"
      : "You're almost there, now take a selfie";
  }

  if (isNewIframeDesktopLayout()) {
    const stateParams = {
      title: data.title,
      buttonTitle: data.ctaText,
      message: data.subtitle,
      image: data.icon,
    };
    internalStorage.setData("handleClick", onCtaClick);
    navigate("/kyc/upload-pan-status", { state: { ...stateParams } });
  }

  return (
    <WVBottomSheet
      isOpen={isOpen}
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

export default PanUploadStatus;
