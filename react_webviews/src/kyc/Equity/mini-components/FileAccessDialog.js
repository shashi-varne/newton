import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";

const FileAccessDialog = ({ isOpen }) => {
  return (
    <Dialog
      open={isOpen}
      className="kyc-file-access-dialog"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="kyc-file-access-dialog-content">
        <div className="kfadc-header">New</div>
        <div className="kfadc-main">
          <div className="kfadc-info">
            <img src={require(`assets/go_to_gallery_green.svg`)} alt="" />
            <div>Folder</div>
          </div>
          <div className="kfadc-info">
            <img src={require(`assets/take_pic_green.svg`)} alt="" />
            <div>Scan</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileAccessDialog;
