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
          {props.popupText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleNo} color="default">
          No
        </Button>
        <Button onClick={props.handleYes} color="default" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopUp;