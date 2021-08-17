import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";
import Button from "../../common/ui/Button";

const ConfirmBackDialog = ({ isOpen, close, goBack }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      keepMounted
      className="kyc-back-confirm-dialog"
    >
      <DialogContent className="kyc-back-confirm-dialog-content">
        <div className="title">
          You are almost there, do you really want to go back?
        </div>
        <div className="confirm-back-dialog-actions">
          <Button
            classes={{ button: "confirm-back-button confirm-back-yes" }}
            onClick={goBack}
            buttonTitle="YES"
          />
          <Button
            classes={{ button: "confirm-back-button" }}
            onClick={close}
            buttonTitle="NO"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmBackDialog;
