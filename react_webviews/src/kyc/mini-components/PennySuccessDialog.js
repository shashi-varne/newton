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
    >
      <DialogContent className="penny-failed-dialog-content">
        <div className="title">
          <div className="text">Bank added successfully</div>
          <img
            src={require(`assets/${productName}/ic_bank_added.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle">
          {!isTradingEnabled() ?
            "Hurrah! Your bank account is added. Invest securely and safely with us."
            :
            "Now, tell us your trading experience in the next step"
          }
        </div>
        <Button className="button bg-full" onClick={() => redirect()}>
          CONTINUE
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PennySuccessDialog;
