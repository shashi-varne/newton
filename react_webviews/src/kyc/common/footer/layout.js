import React, { Component } from "react";

import Button from "../../../common/ui/Button";
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import Buttons from "material-ui/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../Style.scss";

export class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  componentDidMount() {}

  clickHandler = () => {
    if (navigator.onLine) {
      this.props.handleClick();
    } else {
      this.setState({
        openDialog: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonFullWidth"
            onClick={this.handleClose}
            color="default"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    const props = this.props;
    return (
      <div
        className="FooterDefaultLayout"
        onClick={() => {
          if (!props.disable) {
            props.handleClick();
          }
        }}
      >
        <div className="FlexItem2">
          <Buttons
            variant="raised"
            size="large"
            color="secondary"
            type={props.type}
            disabled={props.disable}
            className={`footer-button ${props.buttonClassName} ${
              props.disable && "disabled"
            }`}
          >
            {props.buttonTitle}
            {props.isApiRunning && (
              <div className="loader">
                <CircularProgress size={20} thickness={5} />
              </div>
            )}
          </Buttons>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}

export class TwoButtonLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  componentDidMount() {}

  clickHandler = () => {
    if (navigator.onLine) {
      this.props.handleClick();
    } else {
      this.setState({
        openDialog: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.openDialog}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonFullWidth"
            onClick={this.handleClose}
            color="default"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    const props = this.props;
    return (
      <div className="FooterDefaultLayout">
        <div className="FlexItem2 two-button">
          <Buttons
            variant="raised"
            size="large"
            color="secondary"
            type={props.type}
            disabled={props.disable}
            className={`footer-button first-button ${props.buttonClassName} ${
              props.disable && "disabled"
            }`}
            onClick={() => {
              if (!props.disable && !props.isApiRunning) {
                props.handleClick();
              }
            }}
          >
            {props.buttonTitle}
            {props.isApiRunning && (
              <div className="loader">
                <CircularProgress size={20} thickness={5} />
              </div>
            )}
          </Buttons>
          <Buttons
            variant="raised"
            size="large"
            color="secondary"
            type={props.type}
            disabled={props.disable2}
            className={`footer-button ${props.buttonClassName2} ${
              props.disable2 && "disabled"
            }`}
            onClick={() => {
              if (!props.disable2 && !props.isApiRunning2) {
                props.handleClick2();
              }
            }}
          >
            {props.buttonTitle2}
            {props.isApiRunning2 && (
              <div className="loader">
                <CircularProgress size={20} thickness={5} />
              </div>
            )}
          </Buttons>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
