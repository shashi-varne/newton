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
      data-aid={`wv-fullscreen-dialog-${dataAidSuffix}`}
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
  closeIconPosition = 'left',
  children
}) => {
  return (
    <DialogContent>
      <div style={{ textAlign: closeIconPosition, marginBottom: '40px' }}>
        <Close
          data-aid={`wv-close-dialog-${dataAidSuffix}`}
          color="primary"
          onClick={onCloseClick}
          classes={{ root: 'wv-fullscreen-dialog-close' }}
        />
      </div>
      <div>
        {children}
      </div>
    </DialogContent>
  );
}

WVFullscreenDialog.Content = Content;
WVFullscreenDialog.Action = DialogActions;

export default WVFullscreenDialog;