import React from "react";
import { getConfig } from "utils/functions";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";

const config = getConfig();
const CompliantHelpDialog = ({ close, isOpen, pan }) => {
  return (
    <Dialog
      onClose={() => close()}
      open={isOpen}
      aria-labelledby="help-dialog"
      keepMounted
      aria-describedby="help-dialog"
      className="help-dialog"
      id="kyc-pan-help-dialog"
    >
      <DialogContent className="help-content" data-aid='kyc-help-content'>
        <div className="title">Hey,</div>
        <div className="subtitle">
          To change the PAN: {pan}, <br />
          please reach us at :
        </div>
        <div className="partner-info" data-aid='kyc-partner-info'>
          <div data-aid='kyc-mobile-no'>{config.mobile}</div>
          <div>|</div>
          <div data-aid='kyc-email-id'>{config.email}</div>
        </div>
        <Button data-aid='ok-btn' onClick={() => close()}>OK</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CompliantHelpDialog;
