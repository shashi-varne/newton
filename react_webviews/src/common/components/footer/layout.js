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

export class FooterLayoutBase extends Component {
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

  renderInsuranceSummary = (props) => {
      return(
        <div className="FooterSummaryLayout" onClick={props.handleClick}>

        {!props.onlyButton && <div className="FlexItem1 padLR15">


          {props.showDotDot &&
            <div style={{ marginTop: 8 }}>
              <DotDotLoader></DotDotLoader>
            </div>}
          {!props.showDotDot && <div className="FooterSummaryLayout_title">Premium</div>}
          {props.paymentFrequency && !props.showDotDot &&
            <div className="FooterSummaryLayout_subtitle"> {inrFormatDecimal(props.premium)} {(props.paymentFrequency).toLowerCase()}</div>}

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
      </div>
      )
  }

  TwoButtonLayout = (props) => {
      return(
        <div className="FooterTwoButtonLayout">
        <div >
          <Button
            twoButton={true}
            type={props.type}
            arrow={(props.edit) ? false : true}
            {...props} />
        </div>
      </div>
      )
  }

  WithProviderLayout = (props) =>  {
    const leftArrowMapper = {
        'up': up_arrow,
        'down': down_arrow
      }
      return(
        <div className="FooterDefaultLayout">
        {props.buttonData && <div className="FlexItem1 FlexItem1-withProvider-footer" 
        onClick={props.handleClick2}
        style={props.buttonData.leftStyle}>

          {props.buttonData.logo && <div className='image-block'>
            <img
              alt=""
              src={require(`assets/${props.buttonData.logo}`)}
              className="FooterImage" />
          </div>}
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
              {props.handleClick2 && <SVG
                className="text-block-2-img"
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                src={leftArrowMapper[props.buttonData.leftArrow || 'down']}
              />}
              {props.buttonData.leftSubtitle}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={props.handleClick}>
          <Button
            type={props.type}
            disable={props.buttonDisabled}
            {...props} />
        </div>
      </div>
      )
  }

  insuranceDefault = (props) => {
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
    )
  }

  renderDefaultLayout = (props) => {
    return(
      <div className="FooterDefaultLayout" onClick={props.handleClick}>
      <div className="FlexItem2">
        <Button
          type={props.type}
          {...props} />
      </div>
    </div>
    )
}


  render() {
    const props = this.props;

    let {project} = props;
    let type = props.type || 'default';
    

    if(type === 'default') {
      if(project === 'insurance') {
        //to handle old insurance code, term insurance
        type = 'insuranceDefault';
      }
    }
    
    let renderMapper = {
        'summary': this.renderInsuranceSummary,
        'twobutton': this.TwoButtonLayout,
        'withProvider': this.WithProviderLayout,
        'insuranceDefault': this.insuranceDefault,
        'default': this.renderDefaultLayout,
    }

    console.log(type)

    let renderFunction = renderMapper[type] || renderMapper['default'];


    if(!props.noFooter) {
        return (
            <div>
              {renderFunction(props)}
              {this.renderDialog()}
            </div>
          );
    }

    return null;
    
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