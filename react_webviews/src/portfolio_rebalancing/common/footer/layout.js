import React, { Component } from 'react';

import Button from '../../../common/ui/Button';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

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
      <div className='FooterDefaultLayout' onClick={props.handleClick}>
        <div className='FlexItem2'>
          <Button type={props.type} classes={{ label: 'uppercase-text' }} {...props} />
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
