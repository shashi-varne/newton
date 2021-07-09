import React, { Component } from 'react';

import Button from '../../../common/ui/Button';
import {
  inrFormatDecimal, isFunction
} from '../../../utils/validators';
import DotDotLoader from '../../../common/ui/DotDotLoader';

import down_arrow from 'assets/down_arrow.svg';
import up_arrow from 'assets/up_arrow.svg';
import SVG from 'react-inlinesvg';
import {getConfig} from 'utils/functions';
import logo_safegold from 'assets/logo_safegold.svg';
import logo_mmtc from 'assets/logo_mmtc.svg';
import WVButtonLayout from '../../ui/ButtonLayout/WVButtonLayout';
import {Imgc} from '../../ui/Imgc'
import BottomSheet from '../../ui/BottomSheet';

let genericErrorIcon = 'data:image/png;base64,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';
export class FooterLayoutBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  clickHandler = (handleClickCallback) => {
    if (navigator.onLine) {
      if(isFunction(handleClickCallback)) {
        handleClickCallback();
        return;
      }
      this.props.handleClick();
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  dualButtonClickHandler = (handleClickCallback) => () => {
    if(isFunction(handleClickCallback))
      this.clickHandler(handleClickCallback);
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderDialog = () => {
    return (
      <>
        {this.state.openDialog && (
          <BottomSheet
            open={this.state.openDialog || false}
            data={{
              header_title: "Internet connection error",
              content: "Check internet connection",
              src: genericErrorIcon,
              button_text1: "Retry",
              handleClick1: this.handleClose,
            }}
          />
        )}
      </>
    );
  }

  renderInsuranceSummary = (props) => {
      return(
        <div className="FooterSummaryLayout" onClick={this.clickHandler}>

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
            {...props}
            handleClickOne={this.dualButtonClickHandler(props.handleClickOne)} 
            handleClickTwo={this.dualButtonClickHandler(props.handleClickTwo)} 
          />
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
        onClick={this.dualButtonClickHandler(props.handleClick2)}
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
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
                src={leftArrowMapper[props.buttonData.leftArrow || 'down']}
              />}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={this.clickHandler}>
          <Button
            type={props.type}
            disable={props.disable}
            {...props} />
        </div>
      </div>
      )
  }

  WithProviderLayoutWithdraw = (props) => {
    return (
      <div className="FooterDefaultLayout withdraw-footer-layout">
        {props.buttonData && (
          <div
            className="FlexItem1 FlexItem1-withProvider-footer"
            style={props.buttonData.leftStyle}
          >
            <div className="text-block">
              <div className="text-block-1">{props.buttonData.leftTitle}</div>
              <div className="text-block-2">
                {props.buttonData.leftSubtitle}
              </div>
            </div>
          </div>
        )}
        <div  className="FlexItem2 FlexItem2-withProvider-footer">
          <Button type={props.type} disable={props.disable} onClick={this.clickHandler} {...props} />
        </div>
      </div>
    );
  };

  insuranceDefault = (props) => {
    return (
      <div className="FooterDefaultLayout" onClick={this.clickHandler}>
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
          this.clickHandler();
        }
      }}>
      <div className={`FlexItem2 ${!props.disable ? 'FlexButtonGenericColor' : ''}`} 
        style={{
          borderRadius: getConfig().uiElements?.bottomCta?.borderRadius || 6
        }} 
      >
        <Button
          type={props.type}
          disable={props.disable}
          {...props} />
      </div>
    </div>
    )
  }

  fundDetailsDualButton = (props) => {
    return (
      <div className="FooterTwoButtonLayout">
        <div style={{ display: "flex", width: "100%" }}>
          <Button
            buttonTitle={props.buttonOneTitle}
            style={{
              backgroundColor: "#73C555",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              width: "20%",
              padding: "0px !important",
            }}
            onClick={this.dualButtonClickHandler(props.handleClickOne)} 
          />
          <Button
            buttonTitle={props.buttonTwoTitle}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              width: "80%",
            }}
            onClick={this.dualButtonClickHandler(props.handleClickTwo)} 
          />
        </div>
        {this.renderDialog()}
      </div>
    );
  };


  WithProviderLayoutGold = (props) => {
    const leftArrowMapper = {
      'up': up_arrow,
      'down': down_arrow
    }
    return(
      <div className="FooterDefaultLayout">
          {props.buttonData && <div className="FlexItem1 FlexItem1-withProvider-footer" 
          onClick={this.dualButtonClickHandler(props.handleClick2)}
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
                  preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().styles.primaryColor)}
                  src={leftArrowMapper[props.buttonData.leftArrow] || down_arrow}
                />
                {props.buttonData.leftSubtitle}
                </div>
            </div>
          </div>}
          <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={this.clickHandler}>
            <Button
              type={props.type}
              {...props} />
          </div>
          {this.renderDialog()}
        </div>
    )
  }

  VerticalButtonLayout = ({ button1Props, button2Props }) => {
    const buttonOneProps = {
      ...button1Props,
      onClick: this.dualButtonClickHandler(button1Props.onClick)
    }
    const buttonTwoProps = {
      ...button2Props,
      onClick: this.dualButtonClickHandler(button2Props.onClick)
    }
    return(
      <WVButtonLayout layout="stacked">
        <WVButtonLayout.Button
          {...buttonOneProps}
        />
        <WVButtonLayout.Button
          {...buttonTwoProps}
        />
      </WVButtonLayout>
    )
  }

  WithProviderLayoutLoan = (props) => {
    return(
      <div className="FooterDefaultLayout">
        {props.buttonData && <div className="FlexItem1 FlexItem1-withProvider-footer loan-with-provider" 
        onClick={this.dualButtonClickHandler(props.handleClick2)}
        style={props.buttonData.leftStyle}>
          <div className="text-block">
          <div className="text-block-1">{props.buttonData.leftTitle}</div>
            <div className="text-block-2">
              {props.buttonData.leftSubtitle}
              </div>
          </div>
        </div>}
        <div className="FlexItem2 FlexItem2-withProvider-footer" onClick={this.clickHandler}>
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

    if(project === 'withdraw') {
      if(type === 'withProvider') {
        type = 'withProviderWithdraw';
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
        'twoButtonVertical': this.VerticalButtonLayout,
        'default': this.renderDefaultLayout,
        'withProviderGold': this.WithProviderLayoutGold,
        'fundDetailsDualButton': this.fundDetailsDualButton,
        'withProviderWithdraw': this.WithProviderLayoutWithdraw,
        'withProviderLoan': this.WithProviderLayoutLoan
    }

    let renderFunction = renderMapper[type] || renderMapper['default'];


    if(!props.noFooter) {
        return (
            <div data-aid='cta-button-parent'>
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
      <>
        {this.state.openDialog && (
          <BottomSheet
            open={this.state.openDialog || false}
            data={{
              header_title: "Internet connection error",
              content: "Check internet connection",
              src: genericErrorIcon,
              button_text1: "Retry",
              handleClick1: this.handleClose,
            }}
          />
        )}
      </>
    );
  }

  render() {
    const props = this.props;

    return (
      <div className="FooterDefaultLayout" onClick={this.clickHandler}>
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