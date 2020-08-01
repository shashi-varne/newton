import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
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
  },
});

function PopUp(props) {  
  return (
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
    );
}

export default PopUp;