
/*

Use: A fullscreen dialog with a close button

Example syntax:
  <WVFullscreenDialog open={true} onClose={noop}>
    <WVFullscreenDialog.Content onCloseClick={noop} closeIconPosition="right">
      Add any body content here
    </WVFullscreenDialog.Content>
    <WVFullscreenDialog.Action>
      <span>Add any footer content here</span>
    </WVFullscreenDialog.Action>
  </WVFullscreenDialog>

*/

import './WVFullscreenDialog.scss';
import { Dialog, DialogActions, DialogContent } from '@material-ui/core';
import React from 'react';
import Close from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

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
  onCloseClick, // Callback function to handle 'close' icon click behaviour
  closeIconPosition, // Sets position of 'close' icon, defaults to 'left'
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

Content.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  closeIconPosition: PropTypes.oneOf(['left', 'right']),
}

Content.defaultProps = {
  closeIconPosition: 'left'
}

WVFullscreenDialog.Content = Content; // Extends custom styling over MUI DialogContent
WVFullscreenDialog.Action = DialogActions; // Reuses MUI DialogActions

export default WVFullscreenDialog;