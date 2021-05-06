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
    >
      <DialogContent className="penny-failed-dialog-content">
        <div className="title">
          <div className="text" id='text'>Unable to add bank!</div>
          <img
            src={require(`assets/${productName}/ic_bank_not_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle"  id='subtitle'>
          Bank account verification failed! No worries, please check if you've
          entered correct details.
        </div>
        <Button className="button bg-full" id='check_bank_details' onClick={() => checkBankDetails()}>
          CHECK BANK DETAILS
        </Button>
        <div className="divider">
          <span id='or'>OR</span>
        </div>
        <Button
          className="button border-button"
          id='upload_bank_documents'
          onClick={() => uploadDocuments()}
        >
          UPLOAD BANK DOCUMENTS
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PennyFailedDialog;
