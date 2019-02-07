import React, { Component } from 'react';

import Button from '../../../common/ui/Button';
import { capitalize } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

export class SummaryLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  clickHandler = () => {
    if (navigator.onLine) {
      this.props.handleClick();
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

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
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const props = this.props;

    return (
      <div>
        {!props.noFooter &&
          <div className="FooterSummaryLayout" onClick={props.handleClick}>

            {!props.onlyButton && <div className="FlexItem1 padLR15">
              <div className="FooterSummaryLayout_title">Premium</div>
              <div className="FooterSummaryLayout_subtitle">₹ {props.premium} {capitalize(props.paymentFrequency)}</div>
              {/* {
              (props.provider === 'HDFC' && props.paymentFrequency === 'MONTHLY') &&
              <div className="FooterSummaryLayout_hint">*You’ve to pay <b>3 months premiums</b>.</div>
            } */}
            </div>}
            <div className="FlexItem2">
              <Button
                type={props.type}
                {...props} />
            </div>
          </div>}
        {/* {
          props.reset &&
          <div className="FooterReset">
            <div className="FooterReset_title" onClick={props.handleReset}>Start Again</div>
            <div className="FooterReset_subtitle">By restart, you will loose all your progress!</div>
          </div>
        } */}
        {this.renderDialog()}
      </div>
    );
  }
};

export class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  clickHandler = () => {
    if (navigator.onLine) {
      this.props.handleClick();
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

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
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const props = this.props;

    return (
      <div className="FooterDefaultLayout" onClick={props.handleClick}>
        <div className="FlexItem1">
          <img
            alt=""
            src={props.logo}
            className="FooterImage" />
        </div>
        <div className="FlexItem2">
          <Button
            type={props.type}
            arrow={(props.edit) ? false : true}
            {...props} />
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
