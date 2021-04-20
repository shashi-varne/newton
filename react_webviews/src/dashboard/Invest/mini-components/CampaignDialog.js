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
      aria-labelledby="campaign-dialog"
      keepMounted
      aria-describedby="campaign-dialog"
      className="campaign-dialog"
      id="sdk-campaign-dialog"
    >
      <DialogContent className="verification-failed-dialog-content">
        <div className="title">
          <div className="text">{data?.title}</div>
          <img
            src={data?.image}
            alt=""
            className="img"
          />
        </div>
        <div className="subtitle">{data?.subtitle}</div>
        <div className="action">
          {!data?.action_buttons?.buttons?.length  === 2 && (
            <Button className="button no-bg" onClick={() => cancel()}>
              NOT NOW
            </Button>
          )}
          {

          }
          <Button className="button bg-full" onClick={() => handleClick()}>
            {data.action_buttons?.buttons[0]?.title}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KycStatusDialog;
