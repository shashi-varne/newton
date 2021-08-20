import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import "./FileAccessDialog.scss";

const FileAccessDialog = ({ isOpen, onClose, handleUpload, dataAidSuffix }) => {
  return (
    <Dialog
      open={isOpen}
      className="kyc-file-access-dialog"
      id="kyc-bottom-dialog"
      onClose={() => onClose()}
      data-aid={`kyc-bottom-dialog-${dataAidSuffix}`}
    >
      <DialogContent className="kyc-file-access-dialog-content" data-aid={`kyc-file-access-dialog-content-${dataAidSuffix}`}>
        <div className="kfadc-header" data-aid={`kfadc-header-${dataAidSuffix}`}>Select option</div>
        <div className="kfadc-main" data-aid={`kfadc-main-${dataAidSuffix}`}>
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
