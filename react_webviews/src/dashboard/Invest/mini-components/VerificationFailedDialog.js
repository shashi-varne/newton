import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import './mini-components.scss';

const VerificationFailedDialog = ({
  isOpen,
  close,
  addBank,
  updateDocument,
}) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      aria-labelledby="verification-failed-dialog"
      keepMounted
      aria-describedby="verification-failed-dialog"
      className="verification-failed-dialog"
      id="invest-bottom-dialog"
    >
      <DialogContent className="verification-failed-dialog-content">
        <div className="title">
          <div className="text">Invalid documents!</div>
          <img
            src={require(`assets/${productName}/ic_bank_not_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle">
          Bank account verification failed. Upload correct documents or add a
          new bank.
        </div>
        <div className="action">
          <Button className="button no-bg" onClick={() => addBank()}>
            ADD NEW BANK
          </Button>
          <Button className="button bg-full" onClick={() => updateDocument()}>
            UPDATE DOCUMENT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationFailedDialog;
