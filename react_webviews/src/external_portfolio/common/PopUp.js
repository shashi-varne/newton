import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

function PopUp(props) {  
  return (
    <Dialog
      fullScreen={false}
      open={props.openPopup}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <DialogContentText>
          {props.children}
        </DialogContentText>
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

export default PopUp;