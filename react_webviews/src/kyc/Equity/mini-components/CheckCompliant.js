import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";
import { Imgc } from "../../../common/ui/Imgc";

const CheckCompliant = ({ isOpen }) => {
  return (
    <Dialog
      open={isOpen}
      className="kyc-check-compliant-loader"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="kyc-check-compliant-loader-content">
        <Imgc
          src={require(`assets/ic_verfication_in_progress.gif`)}
          alt=""
          className="kcclc-img"
        />
        <div className="kcclc-title">Checking for PAN compliance</div>
        <div className="kcclc-subtitle">
          Hang on while we check if you’re investment ready
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckCompliant;
