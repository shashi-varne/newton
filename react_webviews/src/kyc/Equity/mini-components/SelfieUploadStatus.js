import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { getConfig } from "../../../utils/functions";
import "./mini-components.scss";
import Button from "../../../common/ui/Button";

const productName = getConfig().productName;
const uploadStatus = {
  success: {
    icon: "upload_success.svg",
    title: "Selfie uploaded",
    subtitle:
      "You're nearly done! Provide income proof in the next step if you want to opt for F&O trading",
    ctcTitle: "CONTINUE",
  },
  failed: {
    icon: "upload_error.svg",
    title: "Selfie upload failed",
    subtitle: "Selfie doesn't match the picture as displayed on your ID proof ",
    ctcTitle: "RETRY",
  },
};
export const SelfieUploadStatus = ({ status, isOpen }) => {
  const data = uploadStatus[status] || {};
  return (
    <Dialog
      open={isOpen}
      className="kyc-selfie-upload-status"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="kyc-selfie-upload-status-content">
        <div className="kyc-selfie-upload-status-info">
          <div>
            <div className="sus-info-title">{data.title}</div>
            <div className="sus-info-subtitle">{data.subtitle}</div>
          </div>
          <img src={require(`assets/${productName}/${data.icon}`)} />
        </div>
        <Button
          buttonTitle={data.ctcTitle}
          classes={{ button: "sus-button" }}
        />
      </DialogContent>
    </Dialog>
  );
};
