import './WVFullscreenDialog.scss';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import React from 'react';
import Close from '@material-ui/icons/Close';

const WVFullscreenDialog = ({
  dataAidSuffix,
  open,
  onClose,
  children
}) => {
  return (
    <Dialog
      dataAidSuffix={dataAidSuffix}
      fullScreen
      open={open}
      onClose={onClose}
      className="wv-fullscreen-dialog"
      aria-labelledby="fullscreen-dialog"
    >
      {children}
    </Dialog>
  );
}

const Content = ({
  dataAidSuffix,
  onCloseClick,
  children
}) => {
  return (
    <DialogContent>
      <Close
        data-aid={`wv-close-dialog-${dataAidSuffix}`}
        color="primary"
        onClick={onCloseClick}
        classes={{ root: 'wv-fullscreen-dialog-close' }}
      />
      {children}
    </DialogContent>
  );
}

WVFullscreenDialog.Content = Content;
WVFullscreenDialog.Action = DialogActions;

export default WVFullscreenDialog;