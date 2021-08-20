import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";

const PennySuccessDialog = ({ isOpen, redirect }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="kyc-dialog"
      keepMounted
      aria-describedby="kyc-dialog"
      className="kyc-penny-failed-dialog"
      id="kyc-bottom-dialog"
      data-aid='kyc-bottom-dialog'
    >
      <DialogContent className="penny-failed-dialog-content" data-aid='kyc-penny-failed-dialog-content'>
        <div className="title" data-aid='kyc-title'>
          <div className="text">Bank is added!</div>
          <img
            src={require(`assets/${productName}/ic_bank_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle" data-aid='kyc-subtitle'>
          Hurrah! Your bank account is added. Invest securely and safely with us.
        </div>
        <Button className="button bg-full" onClick={() => redirect()} data-aid='continue-btn'>
          CONTINUE
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PennySuccessDialog;
