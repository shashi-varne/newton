import React, { Component } from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiDialog: {
      root: {},
      paper: {
        borderRadius: "6px",
        width: "100%",
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
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          fullScreen={false}
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="responsive-dialog-title"
          className="dialog"
        >
          <DialogContent>{this.props.children}</DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default DialogBox;
