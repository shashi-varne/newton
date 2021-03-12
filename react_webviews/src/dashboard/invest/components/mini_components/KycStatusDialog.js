import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "utils/functions";
import Button from "@material-ui/core/Button";

const KycStatusDialog = ({ isOpen, close, handleClick, cancel, data }) => {
  const productName = getConfig().productName;
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      aria-labelledby="verification-failed-dialog"
      keepMounted
      aria-describedby="verification-failed-dialog"
      className="verification-failed-dialog"
      id="invest-bottom-dialog"
    >
      <DialogContent className="verification-failed-dialog-content">
        <div className="title">
          <div className="text">{data.popup_header}</div>
          <img
            src={require(`assets/${productName}/${data.icon}`)}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle">{data.popup_message}</div>
        <div className="action">
          {!data.oneButton && (
            <Button className="button no-bg" onClick={() => cancel()}>
              NOT NOW
            </Button>
          )}
          <Button className="button bg-full" onClick={() => handleClick()}>
            {data.button_text}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycStatusDialog;
