import React, { Component } from 'react';

import Button from '../../../common/ui/Button';
import {
  inrFormatDecimal
} from '../../../utils/validators';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import DotDotLoader from '../../../common/ui/DotDotLoader';

import down_arrow from 'assets/down_arrow.svg';
import up_arrow from 'assets/up_arrow.svg';
import SVG from 'react-inlinesvg';
import {getConfig} from 'utils/functions';

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


              {props.showDotDot &&
                <div style={{ marginTop: 8 }}>
                  <DotDotLoader></DotDotLoader>
                </div>}
              {!props.showDotDot && <div className="FooterSummaryLayout_title">Premium</div>}
              {props.paymentFrequency && !props.showDotDot &&
                <div className="FooterSummaryLayout_subtitle"> {inrFormatDecimal(props.premium)} {(props.paymentFrequency).toLowerCase()}</div>}




              {/* {
              (props.provider === 'HDFC' && props.paymentFrequency === 'MONTHLY') &&
              <div className="FooterSummaryLayout_hint">*You’ve to pay <b>3 months premiums</b>.</div>
            } */}

            </div>}
            {!props.onlyButton && <div className="FlexItem2">
              <Button
                type={props.type}
                {...props} />
            </div>}
            {props.onlyButton && <div className="FlexItem2">
              <Button
                type={props.type}
                {...props} />
            </div>}
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


export class TwoButtonLayout extends Component {
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

  render () {
    const props = this.props;

    return (
      <div className="FooterTwoButtonLayout">
        <div >
          <Button
            twoButton={true}
            type={props.type}
            arrow={(props.edit) ? false : true}
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

    const leftArrowMapper = {
      'up': up_arrow,
      'down': down_arrow
    }

    return (
      <div className="FooterDefaultLayout">
        {props.buttonData && <div className="FlexItem1 FlexItem1-withProvider-footer" 
        onClick={props.handleClick2}
        style={props.buttonData.leftStyle}>
          <div className='image-block'>
            <img
              alt=""
              src={require(`assets/${props.buttonData.logo}`)}
              className="FooterImage" />
          </div>
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
              {props.buttonData.leftSubtitle}
              {props.handleClick2 && <SVG
                className="text-block-2-img"
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                src={leftArrowMapper[props.buttonData.leftArrow] || down_arrow}
              />}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={props.handleClick}>
          <Button
            type={props.type}
            disable={props.buttonDisabled}
            {...props} />
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}