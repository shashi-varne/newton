import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "@material-ui/core/Button";
import "./mini-components.scss";
import { getConfig } from "utils/functions";
const productName = getConfig().productName;
const ResidentDialog = ({ close, open, cancel, aadhaarKyc }) => {
  return (
    <Dialog
      onClose={() => close()}
      open={open}
      aria-labelledby="resident-dialog"
      keepMounted
      aria-describedby="resident-dialog"
      id="kyc-bottom-dialog"
      data-aid='kyc-bottom-dialog'
    >
      <DialogContent className="resident-dialog-content" data-aid='kyc-resident-dialog-content'>
        <main data-aid='kyc-resident-dialog-main'>
          <h1 >Are you an Indian resident?</h1>
          <img
            src={require(`assets/${productName}/ic_indian_resident.svg`)}
            alt=""
          />
        </main>
        <footer data-aid='dialog-footer'>
          <Button
            data-aid='no-btn'
            variant="contained"
            fullWidth
            onClick={() => cancel()}
            className="cancel"
          >
            NO
          </Button>
          <Button
            data-aid='yes-btn'
            variant="contained"
            fullWidth
            color="secondary"
            onClick={() => aadhaarKyc()}
            className="aadhar"
          >
            YES
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentDialog;
