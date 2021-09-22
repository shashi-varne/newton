import React, { useMemo } from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";

const ShowAadharDialog = ({ open, onClose, redirect }) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);

  return (
    <WVBottomSheet
      isOpen={open}
      onClose={onClose}
      title="e-KYC"
      subtitle="Connect to DigiLocker to complete KYC fast & easy"
      image={require(`assets/${productName}/icn_aadhaar_kyc_small.svg`)}
      button1Props={{
        title: "CONNECT DIGILOCKER",
        variant: "contained",
        onClick: redirect,
      }}
      dataAidSuffix="kyc-show-aadhar"
    >
      <main className="kyc-show-aadhar-content" data-aid="kyc-content">
        <div className="info-box" data-aid="info-box-two">
          <img
            src={require(`assets/${productName}/ic_no_doc.svg`)}
            className="icon"
            alt=""
          />
          <div className="title">100% Digital</div>
        </div>
        <div className="info-box" data-aid="info-box-one">
          <img
            src={require(`assets/${productName}/ic_instant.svg`)}
            className="icon"
            alt=""
          />
          <div className="title">Instant & safe</div>
        </div>
      </main>
    </WVBottomSheet>
  );
};

export default ShowAadharDialog;
