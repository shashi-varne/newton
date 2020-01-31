import React, { Component } from 'react';

import Button from '../../../common/ui/Button';
// import { capitalize } from 'utils/validators';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

import logo_safegold from 'assets/logo_safegold.svg';
import down_arrow from 'assets/down_arrow.svg';
import SVG from 'react-inlinesvg';
import {getConfig} from 'utils/functions';

export class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  componentDidMount() {

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
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="default" autoFocus>
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
        <div className="FlexItem2">
          <Button
            type={props.type}
            // arrow={(props.edit) ? false : true}
            {...props} />
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
        <div className="FlexItem1 FlexItem1-withProivder-footer">
          <div className='image-block'>
            <img
              alt=""
              src={props.buttonData.provider === 'safegold' ? logo_safegold: ''}
              className="FooterImage" />
          </div>
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
              <SVG
                className="text-block-2-img"
                // preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                src={down_arrow}
              />
              {props.buttonData.leftSubtitle}
              </div>
          </div>
        </div>
        <div className="FlexItem2 FlexItem2-withProivder-footer">
          <Button
            type={props.type}
            {...props} />
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}