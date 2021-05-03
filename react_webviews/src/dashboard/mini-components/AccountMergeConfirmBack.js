import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";
import Button from "../../common/ui/Button";

const AccountMergeConfirmBack = ({ isOpen, close, goBack }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      keepMounted
      className="account-merge-back-confirm-dialog"
    >
      <DialogContent className="account-merge-back-confirm-dialog-content">
        <div className="title">Are you sure you want to go back?</div>
        <div className="confirm-back-dialog-actions">
          <Button
            classes={{ button: "confirm-back-button confirm-back-yes" }}
            onClick={goBack}
            buttonTitle="LEAVE"
          />
          <Button
            classes={{ button: "confirm-back-button" }}
            onClick={close}
            buttonTitle="ENTER OTP"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountMergeConfirmBack;
