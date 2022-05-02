import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";

const ConfirmBackDialog = ({ isOpen = false, close, goBack, enableBackDrop }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      hideBackdrop={!enableBackDrop}
      keepMounted
      className="kyc-back-confirm-dialog"
    >
      <DialogContent className="kyc-back-confirm-dialog-content">
        <div className="title">
          You're almost there! Do you really want to go back?
        </div>
        <div className="confirm-back-dialog-actions">
          <div
            className="confirm-back-button confirm-back-yes"
            onClick={goBack}
          >
            YES
          </div>
          <div className="confirm-back-button" onClick={close}>
            NO
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmBackDialog;
