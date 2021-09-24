import React, { useMemo } from "react";
import { getConfig } from "utils/functions";
import "./mini-components.scss";
import WVBottomSheet from "../../common/ui/BottomSheet/WVBottomSheet";

const PennyFailedDialog = ({ isOpen, checkBankDetails, uploadDocuments }) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);
  return (
    <WVBottomSheet
      isOpen={isOpen}
      title="Unable to add bank!"
      image={require(`assets/${productName}/ic_bank_not_rejected.svg`)}
      buttonLayout="stackedOR"
      button1Props={{
        title: "CHECK BANK DETAILS",
        onClick: checkBankDetails,
        variant: "contained",
      }}
      button2Props={{
        title: "UPLOAD BANK DOCUMENTS",
        onClick: uploadDocuments,
        variant: "outlined",
      }}
      classes={{
        content: "penny-bank-verification-dialog-content",
      }}
    >
      <div className="generic-page-subtitle penny-bank-verification-dialog-subtitle">
        Bank account verification failed! No worries, please check if you've
        entered correct details.
      </div>
    </WVBottomSheet>
  );
};

export default PennyFailedDialog;
