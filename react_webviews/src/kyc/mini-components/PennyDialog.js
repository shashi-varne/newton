import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { Imgc } from "common/ui/Imgc";
import "./mini-components.scss";

const PennyDialog = ({ isOpen, count }) => {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="kyc-dialog"
      keepMounted
      aria-describedby="kyc-dialog"
      className="kyc-penny-dialog"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="penny-dialog-content">
        <Imgc
          src={require(`assets/ic_verfication_in_progress.gif`)}
          alt=""
          className="img"
        />
        <div className="title" id='verify_bank_account'>
          Verifying your bank account <span id='time_count'>00:{count}</span>
        </div>
        <div className="subtitle" id='subtitle'>
          Hold on, while we verify your bank account. Please don’t close the
          app.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PennyDialog;
