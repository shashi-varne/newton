import React from "react";
import { getConfig, isTradingEnabled } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";
import { checkDLPanFetchAndApprovedStatus, isDigilockerFlow, isEquityCompleted } from "../common/functions";
import { storageService } from "../../utils/validators";

const PennySuccessDialog = ({ isOpen, kyc, redirect }) => {
  const config = getConfig();
  const productName = config.productName;
  const TRADING_ENABLED = isTradingEnabled(kyc);
  const isEquityCompletedBase = isEquityCompleted();
  const isPanFailedAndNotApproved = checkDLPanFetchAndApprovedStatus(kyc);
  const fromUploadDocumentsScreen = storageService().get("bankEntryPoint") === "uploadDocuments";
  const isManualFlow = kyc?.kyc_type === "manual";

  let content = "Now, tell us your trading experience in the next step";
  if (!TRADING_ENABLED || 
    isManualFlow || 
    (isDigilockerFlow(kyc) && isPanFailedAndNotApproved) || 
    fromUploadDocumentsScreen || 
    isEquityCompletedBase
  ) {
    content = "Hurrah! Your bank account is added. Invest securely and safely with us."
  }

  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Bank added successfully"
      image={require(`assets/${productName}/ic_bank_verified.svg`)}
      button1Props={{
        title: "CONTINUE",
        onClick: redirect,
        variant: "contained",
      }}
      classes={{
        content: "penny-bank-verification-dialog-content",
      }}
    >
      <div className="generic-page-subtitle penny-bank-verification-dialog-subtitle">
        {content}
      </div>
    </WVBottomSheet>
  );
};

export default PennySuccessDialog;
