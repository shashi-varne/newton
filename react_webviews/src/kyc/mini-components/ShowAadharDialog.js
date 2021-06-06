import React from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";

const productName = getConfig().productName;
const ShowAadharDialog = ({ open, onClose, redirect }) => {

  return (
    <WVBottomSheet
      isOpen={open}
      onClose={onClose}
      title="Aadhaar KYC"
      subtitle="Link with DigiLocker to complete paperless KYC"
      image={require(`assets/${productName}/icn_aadhaar_kyc_small.svg`)}
      button1Props={{
        title: "CONNECT DIGILOCKER",
        type: "primary",
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
          <div className="title">No document asked</div>
        </div>
        <div className="info-box" data-aid="info-box-one">
          <img
            src={require(`assets/${productName}/ic_instant.svg`)}
            className="icon"
            alt=""
          />
          <div className="title">Instant Investment</div>
        </div>
      </main>
    </WVBottomSheet>
  );
};

export default ShowAadharDialog;
