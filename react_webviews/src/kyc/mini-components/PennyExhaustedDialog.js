import React from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";

const productName = getConfig().productName;
const PennyExhaustedDialog = ({ isOpen, redirect, uploadDocuments }) => {
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Unable to add bank!"
      image={require(`assets/${productName}/ic_bank_not_rejected.svg`)}
      buttonLayout="stacked"
      button1Props={{
        title: "UPLOAD BANK DOCUMENTS",
        onClick: uploadDocuments,
        type: "primary",
      }}
      button2Props={{
        title: "TRY LATER",
        onClick: redirect,
        type: "textonly",
      }}
      classes={{
        content: "penny-bank-verification-dialog-content",
      }}
    >
      <div className="generic-page-subtitle penny-bank-verification-dialog-subtitle">
        Oops! You have exhausted all the 3 attempts. Continue by uploading your
        documents or check back later
      </div>
    </WVBottomSheet>
  );
};

export default PennyExhaustedDialog;
