import React, { Component } from "react";

import Button from "../../../common/ui/Button";
import CustomButton from "material-ui/Button";
// import { capitalize } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "material-ui/Dialog";
import logo_safegold from "assets/logo_safegold.svg";
import logo_mmtc from "assets/logo_mmtc.svg";
import down_arrow from "assets/down_arrow.svg";
import up_arrow from "assets/up_arrow.svg";
import SVG from "react-inlinesvg";
import { getConfig } from "utils/functions";

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
          <Button
            type={props.type}
            disable={props.disable}
            // arrow={(props.edit) ? false : true}
            {...props}
          />
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
        <div className="button">
          <div className="not-now">
            <CustomButton
              variant="raised"
              size="large"
              fullWidth={true}
              onClick={props.handleClickOne}
            >
              {props.buttonOneTitle}
            </CustomButton>
          </div>

          <CustomButton
            variant="raised"
            size="large"
            color="secondary"
            fullWidth={true}
            onClick={props.handleClickTwo}
          >
            {props.buttonTwoTitle}
          </CustomButton>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}

export class WithProviderLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

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
            color="secondary"
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

    const leftArrowMapper = {
      up: up_arrow,
      down: down_arrow,
    };

    return (
      <div className="FooterDefaultLayout" style={{ padding: "5px 0 5px 0" }}>
        {props.buttonData && (
          <div
            className="FlexItem1 FlexItem1-withProvider-footer"
            onClick={props.handleClick2}
            style={props.buttonData.leftStyle}
          >
            {props.buttonData.provider && (
              <div className="image-block">
                <img
                  alt=""
                  src={
                    props.buttonData.provider === "safegold"
                      ? logo_safegold
                      : logo_mmtc
                  }
                  className="FooterImage"
                />
              </div>
            )}
            <div className="text-block" style={{ margin: "0 0 0 10px" }}>
              <div className="text-block-1">{props.buttonData.leftTitle}</div>
              <div className="text-block-2">
                {props.buttonData.leftArrow && (
                  <SVG
                    className="text-block-2-img"
                    preProcessor={(code) =>
                      code.replace(/fill=".*?"/g, "fill=" + getConfig().primary)
                    }
                    src={
                      leftArrowMapper[props.buttonData.leftArrow] || down_arrow
                    }
                  />
                )}
                {props.buttonData.leftSubtitle}
              </div>
            </div>
          </div>
        )}
        <div
          className="FlexItem2 FlexItem2-withProvider-footer"
          onClick={() => {
            if (!props.disable) {
              props.handleClick();
            }
          }}
        >
          <Button type={props.type} disable={props.disable} {...props} />
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
