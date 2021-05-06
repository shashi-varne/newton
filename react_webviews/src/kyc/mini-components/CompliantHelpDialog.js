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
      <DialogContent className="help-content">
        <div className="title" id='title'>Hey,</div>
        <div className="subtitle" id='subtitle'>
          To change the PAN: {pan}, <br />
          please reach us at :
        </div>
        <div className="partner-info">
          <div id='mobile_no'>{config.mobile}</div>
          <div>|</div>
          <div id='email_id'>{config.email}</div>
        </div>
        <Button onClick={() => close()}>OK</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CompliantHelpDialog;
