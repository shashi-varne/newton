
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
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import Close from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import WVInPageTitle from '../InPageHeader/WVInPageTitle';

const WVFullscreenDialog = ({
  dataAidSuffix,
  open,
  onClose,
  children,
  customCloseIcon,
  closeIconPosition, // Sets position of 'close' icon, defaults to 'left'
  title, 
  ...dialogProps
}) => {

  const CloseIcon = customCloseIcon || Close;

  return (
    <Dialog
      data-aid={`wv-fullscreen-dialog-${dataAidSuffix}`}
      fullScreen
      open={open}
      onClose={onClose}
      className="wv-fullscreen-dialog"
      aria-labelledby="fullscreen-dialog"
      {...dialogProps}
    >
      <DialogTitle style={{ padding: '20px' }}>
        <div style={{ textAlign: closeIconPosition }}>
          <CloseIcon
            data-aid={`wv-fd-close-dialog-${dataAidSuffix}`}
            color="primary"
            onClick={onClose}
            classes={{ root: 'wv-fd-close' }}
          />
        </div>
        {title &&
          <WVInPageTitle style={{ marginTop: '20px' }}>{title}</WVInPageTitle>
        }
      </DialogTitle>
      {children}
    </Dialog>
  );
}

const Content = ({
  children
}) => {
  return (
    <DialogContent>
      <div className="wv-fd-content-body">
        {children}
      </div>
    </DialogContent>
  );
}

WVFullscreenDialog.propTypes = {
  closeIconPosition: PropTypes.oneOf(['left', 'right']),
  title: PropTypes.node,
}

WVFullscreenDialog.defaultProps = {
  closeIconPosition: 'right',
  title: ''
}

WVFullscreenDialog.Content = Content; // Extends custom styling over MUI DialogContent
WVFullscreenDialog.Action = DialogActions; // Reuses MUI DialogActions

export default WVFullscreenDialog;