import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";

const AccountMerge = ({ isOpen, close, data, handleClick }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      aria-labelledby="kyc-dialog"
      keepMounted
      aria-describedby="kyc-dialog"
      className="account-merge-dialog"
      id="kyc-bottom-dialog"
      data-aid='kyc-bottom-dialog'
    >
      <DialogContent className="account-merge-dialog-content" data-aid='kyc-account-merge-dialog-content'>
        <div className="title" data-aid='account-merger-title'>
          <div className="text">{data.title}</div>
          <img
            src={require(`assets/${productName}/ic_popup_kyc_pending.svg`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle" data-aid='account-merger-subtitle'>{data.subtitle}</div>
        <div className="action">
          <Button className="button no-bg" onClick={() => close()} data-aid='re-enter-pin-btn'>
            RE-ENTER PAN
          </Button>
          <Button
            className="button bg-full"
            onClick={() => handleClick(data.step)}
            data-aid='account-merge-btn'
          >
            {data.buttonTitle || ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountMerge;
