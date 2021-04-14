import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";

const PennyExhaustedDialog = ({ isOpen, redirect, uploadDocuments }) => {
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
          <div className="text">Unable to add bank!</div>
          <img
            src={require(`assets/${productName}/ic_bank_not_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle">
          Oops! You have exhausted all the 3 attempts. Continue by uploading
          your documents or check back later
        </div>
        <Button
          className="button bg-full bottom-margin"
          onClick={() => uploadDocuments()}
        >
          UPLOAD BANK DOCUMENTS
        </Button>
        <Button className="button highlight-bg" onClick={() => redirect()}>
          TRY AGAIN LATER
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PennyExhaustedDialog;
