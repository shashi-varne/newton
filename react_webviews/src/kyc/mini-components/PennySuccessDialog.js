import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig, isTradingEnabled } from "utils/functions";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";

const config = getConfig();
const productName = config.productName;
const PennySuccessDialog = ({ isOpen, redirect }) => {
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
          <div className="text">Bank added successfully</div>
          <img
            src={require(`assets/${productName}/ic_bank_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle"  data-aid='kyc-subtitle'>
          {!isTradingEnabled() ?
            "Hurrah! Your bank account is added. Invest securely and safely with us."
            :
            "Now, tell us your trading experience in the next step"
          }
        </div>
        <Button className="button bg-full" onClick={() => redirect()} data-aid='continue-btn'>
          CONTINUE
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PennySuccessDialog;
