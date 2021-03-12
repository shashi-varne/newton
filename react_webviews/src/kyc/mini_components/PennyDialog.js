import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { Imgc } from "common/ui/Imgc";

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
        <div className="title">
          Verifying your bank account <span>00:{count}</span>
        </div>
        <div className="subtitle">
          Hold on, while we verify your bank account. Please don’t close the
          app.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PennyDialog;
