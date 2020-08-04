import React, { Component } from "react";
import { withRouter } from "react-router";
import Button from "material-ui/Button";
import Dialog, {
  DialogContent,
} from "material-ui/Dialog";
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

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopup: props.openPopup,
    };
  }

  componentDidMount() {}

  handleClose = () => {
    this.setState({
      openPopup: false,
    });
  };

  handlePopup = () => {
    this.setState({
      openPopup: false,
    });
  };

  renderPopup = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          fullScreen={false}
          open={this.state.openPopup}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
          className="dialog"
        >
          <DialogContent>
            {this.props.dialogContent}
          </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  };

  render() {
    return (
      <div className={`ContainerWrapper`}>
        <div className={`Container ${this.props.classOverRideContainer}`}>
          {this.props.children}
        </div>
        {this.renderPopup()}
      </div>
    );
  }
}

export default withRouter(Container);
