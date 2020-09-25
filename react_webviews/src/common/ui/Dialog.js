import React, { Component } from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiDialog: {
      root: {},
      paper: {
        margin: '0 12px !important'
      },
    },
    MuiDialogContent: {
      root: {
        padding: '14px !important',
      },
    },
  },
});

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: false,
    };
  }

  handleClose = () => {
    this.setState({
      openPopup: false,
    });
  };

  render() {
    const { root, paper, container } = this.props.classes || {};
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          fullScreen={this.props.fullScreen}
          fullWidth={this.props.fullWidth}
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="responsive-dialog-title"
          classes={{root, paper, container}}
          {...this.props}
        >
          <DialogContent>{this.props.children}</DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default DialogBox;
