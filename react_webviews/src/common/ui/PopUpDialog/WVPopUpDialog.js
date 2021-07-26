import React from 'react';
import { Button } from '@material-ui/core';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

function WVPopUpDialog({
  open,
  onClose,
  text,
  optionNo = 'no',
  handleNo,
  optionYes = 'yes',
  handleYes
}) {
  return (
    <Dialog
      fullScreen={false}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo} color="default">
          {optionNo}
        </Button>
        <Button onClick={handleYes} color="default" autoFocus>
          {optionYes}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WVPopUpDialog;