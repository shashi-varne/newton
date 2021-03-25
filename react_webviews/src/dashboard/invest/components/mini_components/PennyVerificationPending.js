import React from "react";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";

const PennyVerificationPending = ({ isOpen, handleClick }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen ? isOpen : false}
      aria-labelledby="success-dialog"
      keepMounted
      aria-describedby="success-dialog"
      className="invest-redeem-dialog"
      id="invest-bottom-dialog penny-verification-pending"
    >
      <DialogContent className="dialog-content">
        <div className="head-bar">
          <div className="text-left">Bank account verification pending!</div>
          <img
            src={require(`assets/${productName}/ic_bank_partial_added.svg`)}
            alt=""
          />
        </div>
        <div className="subtitle text">
          You can invest only after you have a verified bank added. Upload
          document or add new bank to start investing.
        </div>
      </DialogContent>
      <DialogActions className="action">
        <Button onClick={handleClick} className="button">
          MANAGE BANK ACCOUNT
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PennyVerificationPending;
