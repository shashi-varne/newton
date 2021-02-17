import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import Button from "@material-ui/core/Button";
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
    >
      <DialogContent className="resident-dialog-content">
        <main>
          <h1>Are you an Indian resident?</h1>
          <img
            src={require(`assets/${productName}/ic_indian_resident.svg`)}
            alt=""
          />
        </main>
        <footer>
          <Button
            variant="contained"
            fullWidth
            onClick={() => cancel()}
            className="cancel"
          >
            NO
          </Button>
          <Button
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
