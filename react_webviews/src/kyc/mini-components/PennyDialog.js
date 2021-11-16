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
      data-aid='kyc-bottom-dialog'
    >
      <DialogContent className="penny-dialog-content" data-aid='penny-dialog-content'>
        <Imgc
          src={require(`assets/ic_verfication_in_progress.gif`)}
          alt=""
          className="img"
        />
        <div className="title" data-aid='dialog-title'>
          Verifying bank account <span>00:{count < 10 ? `0${count}` : count}</span>
        </div>
        <div className="subtitle" data-aid='dialog-subtitle'>
          Please wait, while we verify your bank account. Don’t close the app or press back.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PennyDialog;
