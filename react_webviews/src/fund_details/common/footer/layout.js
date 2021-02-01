import React, { Component } from 'react';

import Button from '../../../common/ui/Button';
// import { capitalize } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';
import  Buttons from '@material-ui/core/Button';

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
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>Check your connection and try again.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className='DialogButtonFullWidth'
            onClick={this.handleClose}
            color='default'
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
        className='FooterDefaultLayout'
        onClick={() => {
          if (!props.disable) {
            props.handleClick();
          }
        }}
      >
        <div className='FlexItem2'>
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
        <div className="FlexItem2">
          <div className="fund-detail-two-button">
            <Buttons
              className="button button1"
              onClick={() => props.handleClick()}
            >
              {props.buttonTitle}
            </Buttons>
            <Buttons
              className="button button2"
              onClick={() => props.handleClick2()}
            >
              {props.buttonTitle2}
            </Buttons>
          </div>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
