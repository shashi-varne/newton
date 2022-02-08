import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  MuiDialogContent: {
    root: {
      padding: '0 20px 24px 20px !important',
    },
  },
  MuiDialogActions: {
    action: {
      padding: '8px 16px',
    }
  },
  MuiButton: {
    label: {
      fontSize: '12px !important',
      fontWeight: 'bold !important',
      letterSpacing: '1px !important',
      textTransform: 'uppercase !important',
    },
  }
});

function PopUp(props) {  
  return (
    <Dialog
      fullScreen={false}
      open={props.openPopup}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        {props.children}
      </DialogContent>
      {props.onlyExit ?
        (
          <DialogActions>
            <Button onClick={props.handleNo} color="default">
              Ok
            </Button>
          </DialogActions>
        ) : (
        <DialogActions>
          <Button onClick={props.handleNo} color="default">
            {props.cancelText || 'No'}
          </Button>
          <Button onClick={props.handleYes} color="default" autoFocus>
            {props.okText || 'Yes'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default withStyles(styles)(PopUp);