
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
import WVInPageTitle from '../InPageHeader/WVInPageTitle';

const WVFullscreenDialog = ({
  dataAidSuffix,
  open,
  onClose,
  children,
  ...dialogProps
}) => {
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
      {children}
    </Dialog>
  );
}

const Content = ({
  dataAidSuffix,
  onCloseClick, // Callback function to handle 'close' icon click behaviour
  closeIconPosition, // Sets position of 'close' icon, defaults to 'left'
  headerTitle, // Will show up as a sticky title at top of page under 'close' 
  children
}) => {
  return (
    <DialogContent>
      <div className="wv-fd-content-header" style={{ textAlign: closeIconPosition }}>
        <Close
          data-aid={`wv-fd-close-dialog-${dataAidSuffix}`}
          color="primary"
          onClick={onCloseClick}
          classes={{ root: 'wv-fd-close' }}
        />
        {headerTitle &&
          <WVInPageTitle style={{ marginTop: '20px' }}>{headerTitle}</WVInPageTitle>
        }
      </div>
      <div className="wv-fd-content-body">
        {children}
      </div>
    </DialogContent>
  );
}

Content.propTypes = {
  onCloseClick: PropTypes.func.isRequired,
  closeIconPosition: PropTypes.oneOf(['left', 'right']),
  headerTitle: PropTypes.node,
}

Content.defaultProps = {
  closeIconPosition: 'left',
  headerTitle: ''
}

WVFullscreenDialog.Content = Content; // Extends custom styling over MUI DialogContent
WVFullscreenDialog.Action = DialogActions; // Reuses MUI DialogActions

export default WVFullscreenDialog;