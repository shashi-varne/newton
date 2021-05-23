import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./mini-components.scss";

const FileAccessDialog = ({ isOpen, onClose, handleUpload, docSide }) => {
  return (
    <Dialog
      open={isOpen}
      className="kyc-file-access-dialog"
      id="kyc-bottom-dialog"
      onClose={() => onClose()}
      data-aid='kyc-bottom-dialog'
    >
      <DialogContent className="kyc-file-access-dialog-content" data-aid='kyc-file-access-dialog-content'>
      <div className="kfadc-header" data-aid='kfadc-header'>Select option</div>
        <div className="kfadc-main" data-aid='kfadc-main'>
          <div className="kfadc-info" data-aid='kfadc-info-gallery' onClick={() => handleUpload("open_gallery", docSide)}>
            <img src={require(`assets/go_to_gallery_green.svg`)} alt="" />
            <div>Gallery</div>
          </div>
          <div className="kfadc-info" data-aid='kfadc-info-camera' onClick={() => handleUpload("open_camera", docSide)}>
            <img src={require(`assets/take_pic_green.svg`)} alt="" />
            <div>Camera</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileAccessDialog;
