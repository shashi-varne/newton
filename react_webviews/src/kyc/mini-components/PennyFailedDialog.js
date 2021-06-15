import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";

const PennyFailedDialog = ({ isOpen, checkBankDetails, uploadDocuments }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="kyc-dialog"
      keepMounted
      aria-describedby="kyc-dialog"
      className="kyc-penny-failed-dialog"
      id="kyc-bottom-dialog"
      data-aid='kyc-bottom-dialog'
    >
      <DialogContent className="penny-failed-dialog-content" data-aid='kyc-penny-failed-dialog-content'>
        <div className="title" data-aid='kyc-title'>
          <div className="text">Unable to add bank!</div>
          <img
            src={require(`assets/${productName}/ic_bank_not_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle"  data-aid='kyc-subtitle'>
          Bank account verification failed! No worries, please check if you've
          entered correct details.
        </div>
        <Button className="button bg-full" data-aid='kyc-check-bank-details-btn' onClick={() => checkBankDetails()}>
          CHECK BANK DETAILS
        </Button>
        <div className="divider">
          <span>OR</span>
        </div>
        <Button
          className="button border-button"
          data-aid='kyc-upload-bank-documents-btn'
          onClick={() => uploadDocuments()}
        >
          UPLOAD BANK DOCUMENTS
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PennyFailedDialog;
