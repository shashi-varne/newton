import React from "react";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import Button from "common/ui/Button";
import "../commonStyles.scss";

const InvestError = ({ isOpen, handleClick, errorMessage, close }) => {
  if (!errorMessage) {
    errorMessage = "Something went wrong. Please try again later";
  }
  const getMessage = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.innerHTML = errorMessage || "";
  };

  return (
    <Dialog
      open={isOpen ? isOpen : false}
      aria-labelledby="success-dialog"
      keepMounted
      aria-describedby="success-dialog"
      className="invest-common-dialog"
      id="invest-error"
      data-aid='"invest-error"'
      onClose={close}
    >
      <DialogContent className="dialog-content" data-aid='invest-error'>
        <div className="error-message" id="error-message"></div>
      </DialogContent>
      <DialogActions className="action">
        <Button
          onClick={handleClick}
          classes={{ button: "invest-dialog-transparent-button" }}
          buttonTitle="GOT IT!"
          dataAid='got-it'
        />
      </DialogActions>
      {getMessage("error-message")}
    </Dialog>
  );
};

export default InvestError;
