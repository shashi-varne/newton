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
import logo_safegold from 'assets/logo_safegold.svg';
import logo_mmtc from 'assets/logo_mmtc.svg';
import {Imgc} from '../../ui/Imgc'

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

  WithProviderLayoutInsurance = (props) =>  {
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
            <Imgc
              style={{width:'40px', height:'40px'}}
              alt=""
              src={require(`assets/${props.buttonData.logo}`)}
              className="FooterImage" />
          </div>}
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
            {props.buttonData.leftSubtitle}
              {props.handleClick2 && <SVG
                className="text-block-2-img"
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                src={leftArrowMapper[props.buttonData.leftArrow || 'down']}
              />}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={props.handleClick}>
          <Button
            type={props.type}
            disable={props.disable}
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
      <div className="FooterDefaultLayout" onClick={() => {
        if (!props.disable) {
          props.handleClick();
        }
      }}>
      <div className={`FlexItem2 ${!props.disable ? 'FlexButtonGenericColor' : ''}`}>
        <Button
          type={props.type}
          disable={props.disable}
          {...props} />
      </div>
    </div>
    )
  }

WithProviderLayoutGold = (props) => {
  const leftArrowMapper = {
    'up': up_arrow,
    'down': down_arrow
  }
  return(
    <div className="FooterDefaultLayout">
        {props.buttonData && <div className="FlexItem1 FlexItem1-withProvider-footer" 
        onClick={props.handleClick2}
        style={props.buttonData.leftStyle}>
          <div className='image-block'>
            <img
              alt=""
              src={props.buttonData.provider === 'safegold' ? logo_safegold: logo_mmtc}
              className="FooterImage" />
          </div>
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
              <SVG
                className="text-block-2-img"
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().primary)}
                src={leftArrowMapper[props.buttonData.leftArrow] || down_arrow}
              />
              {props.buttonData.leftSubtitle}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={props.handleClick}>
          <Button
            type={props.type}
            {...props} />
        </div>
        {this.renderDialog()}
      </div>
  )
}

  WithProviderLayoutLoan = (props) => {
    return(
      <div className="FooterDefaultLayout">
        {props.buttonData && <div className="FlexItem1 FlexItem1-withProvider-footer loan-with-provider" 
        onClick={props.handleClick2}
        style={props.buttonData.leftStyle}>
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
              {props.buttonData.leftSubtitle}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={props.handleClick}>
          <Button
            type={props.type}
            {...props} />
        </div>
        {this.renderDialog()}
      </div>
    )
  }

  render() {
    const props = this.props;

    let project = props.project || getConfig().project;
    let type = props.type || 'default';

    if (project === 'group-insurance') {
      project = 'insurance';
    }
    if(project === 'insurance') {
      if(type === 'default') {
        //to handle old insurance code, term insurance
        type = 'insuranceDefault';
      }

      if(type === 'withProvider') {
        type = 'withProviderInsurance';
      }
    }

    if(type === 'summary') {
      if(project !== 'insurance') {
        type = 'default';
      }
    }

    if(project === 'gold') {
      if(type === 'withProvider') {
        type = 'withProviderGold';
      }
    }

    if(project === 'lending') {
      if(type === 'withProvider') {
        type = 'withProviderLoan';
      }
    }
    let renderMapper = {
        'summary': this.renderInsuranceSummary,
        'twobutton': this.TwoButtonLayout,
        'withProviderInsurance': this.WithProviderLayoutInsurance,
        'insuranceDefault': this.insuranceDefault,
        'default': this.renderDefaultLayout,
        'withProviderGold': this.WithProviderLayoutGold,
        'withProviderLoan': this.WithProviderLayoutLoan
    }

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