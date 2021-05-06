import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";

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
          <div className="text" id='text_details'>Unable to add bank!</div>
          <img
            src={require(`assets/${productName}/ic_bank_not_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle" id='subtitle_details' >
          Oops! You have exhausted all the 3 attempts. Continue by uploading
          your documents or check back later
        </div>
        <span id='submit-button'>
        <Button
          className="button bg-full bottom-margin"
          onClick={() => uploadDocuments()}
        >
          UPLOAD BANK DOCUMENTS
        </Button></span>
        <span id='try-again-button'>
        <Button className="button highlight-bg" onClick={() => redirect()}>
          TRY AGAIN LATER
        </Button></span>
      </DialogContent>
    </Dialog>
  );
};

export default PennyExhaustedDialog;
