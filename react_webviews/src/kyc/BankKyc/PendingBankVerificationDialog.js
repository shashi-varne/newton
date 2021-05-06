import React from "react";
import { Button } from "@material-ui/core";
import { getConfig } from "../../utils/functions";
import Dialog, { DialogContent } from "material-ui/Dialog";

const PendingBankVerificationDialog = (props) => {
  const { title, description, label, close, open, proceed } = props;
  const productName = getConfig().productName;
  const handleProceed = () => {
    close();
    proceed();
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="kyc-dialog"
      keepMounted
      aria-describedby="kyc-dialog"
      className="kyc-penny-failed-dialog"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="penny-failed-dialog-content">
        <div className="title">
          <div className="text" id='title-text'>{title}</div>
          <img
            src={require(`assets/${productName}/ic_bank_partial_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle" id='description'>{description}</div>
        <Button className="button bg-full" onClick={handleProceed}>
          {label}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PendingBankVerificationDialog;
