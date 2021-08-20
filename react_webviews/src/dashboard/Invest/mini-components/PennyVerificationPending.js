import React from "react";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "common/ui/Button";
import "../commonStyles.scss";
import "./mini-components.scss";

const PennyVerificationPending = ({ isOpen, handleClick }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen ? isOpen : false}
      aria-labelledby="success-dialog"
      keepMounted
      aria-describedby="success-dialog"
      className="invest-common-dialog penny-verification-pending-dialog"
      id="invest-bottom-dialog"
      data-aid='invest-bottom-dialog'
    >
      <DialogContent className="dialog-content" data-aid='penny-verification-pending'>
        <div className="head-bar" data-aid='head-bar'>
          <div className="text-left">Bank account verification pending!</div>
          <img
            src={require(`assets/${productName}/ic_bank_partial_added.svg`)}
            alt=""
          />
        </div>
        <div className="subtitle text" data-aid='pvp-subtitle'>
          You can invest only after you have a verified bank added. Upload
          document or add new bank to start investing.
        </div>
      </DialogContent>
      <DialogActions className="action">
        <Button
          onClick={handleClick}
          classes={{ button: "invest-dialog-button" }}
          buttonTitle="MANAGE BANK ACCOUNT"
          dataAid='manage-bank-account-btn'
        />
      </DialogActions>
    </Dialog>
  );
};

export default PennyVerificationPending;
