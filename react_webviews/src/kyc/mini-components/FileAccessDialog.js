import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";

const FileAccessDialog = ({ isOpen, handleUpload }) => {
  return (
    <Dialog
      open={isOpen}
      className="kyc-file-access-dialog"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="kyc-file-access-dialog-content">
      <div className="kfadc-header">Select option</div>
        <div className="kfadc-main">
          <div className="kfadc-info" onClick={() => handleUpload("open_gallery")}>
            <img src={require(`assets/go_to_gallery_green.svg`)} alt="" />
            <div>Gallery</div>
          </div>
          <div className="kfadc-info" onClick={() => handleUpload("open_camera")}>
            <img src={require(`assets/take_pic_green.svg`)} alt="" />
            <div>Camera</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileAccessDialog;
