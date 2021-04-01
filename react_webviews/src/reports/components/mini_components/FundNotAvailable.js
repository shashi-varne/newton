import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "@material-ui/core/Button";

const FundNotAvailable = ({ isOpen, data, close }) => {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="reports-dialog"
      keepMounted
      aria-describedby="reports-dialog"
      className="reports-no-fund-message-dialog"
      id="reports-no-fund-message-dialog"
    >
      <DialogContent className="reports-no-fund-message-dialog-content">
        <div className="text">
          Sorry! {data.mfname} ICICI Prudential Liquid Fund - Growth is no
          longer available for purchase
        </div>
        <div className="align-right">
          <Button onClick={() => close()}>OKAY</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FundNotAvailable;
