import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "@material-ui/core/Button";

const AskInvestType = ({ isOpen, data, handleClick1, handleClick2 }) => {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="reports-dialog"
      keepMounted
      aria-describedby="reports-dialog"
      className="reports-ask-invest-type-dialog"
      id="reports-ask-invest-type-dialog"
    >
      <DialogContent className="reports-ask-invest-type-dialog-content">
        <div className="text">{data.message}</div>
        <div className="align-right">
          <Button className="bg-light" onClick={() => data.handleClick1()}>
            {data.button1Title}
          </Button>
          <Button className="bg-full" onClick={() => data.handleClick2()}>
            {data.button2Title}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskInvestType;
