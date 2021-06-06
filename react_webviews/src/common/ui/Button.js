import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import arrow from 'assets/next_arrow.png';
import download from 'assets/download.svg';
import SVG from 'react-inlinesvg';
import './style.scss';
import { getConfig } from 'utils/functions';

import DotDotLoaderNew from './DotDotLoaderNew';
import { disableBodyTouch } from 'utils/validators';

const typeToClass = {
  'outlined' : 'generic-button-outlined',
  'textonly': 'generic-button-textonly'
}

class CustomButton extends Component {
  render() {
    let props = this.props;
    let showLoader = props.showLoader;
    showLoader = showLoader === 'button' ? true : false;

    if(props.multipleCTA && showLoader){
      disableBodyTouch(); //disable touch
    }else if((!showLoader || !props.showError) && !props.multipleCTA){
      disableBodyTouch(true); //touch enabled
    }

    if(props.showError){
      // disableBodyOverflow();
    }

    const { button: buttonClass, ...classes } = props.classes || {};

      if(props.iframe){
        return(
          <div>
          <Button
            fullWidth={(props.reset || props.type === 'summary') ? true : false}
            variant="raised"
            size="large"
            color="secondary"
            style={{backgroundColor: getConfig().secondary, color: 'white', width: '310px' , height: '50px'}}
            className={buttonClass}
            classes={classes}
            disabled={props.disable}
          >
            {props.buttonTitle}
            {
              props.arrow &&
              <img alt="" src={arrow} width={20} className="FooterButtonArrow" />
            }
          </Button>
        </div>
        )
      }

    if (props.twoButton && props.dualbuttonwithouticon) {
      return (
        <div className="FlexButton">
          <Button
            onClick={props.handleClickOne}
            fullWidth={false}
            variant="raised"
            size="large"
            className={`${buttonClass} borderButton`}
            style={{color: getConfig().secondary, borderColor: getConfig().secondary,
            flex: !getConfig().isMobileDevice ? 'inherit': 2}}
            disabled={props.disable}
          >
            {props.buttonOneTitle}
          </Button>
          <Button
            onClick={props.handleClickTwo}
            fullWidth={false}
            variant="raised"
            size="large"
            color="secondary"
            style={{ borderColor: getConfig().secondary, 
              flex: !getConfig().isMobileDevice ? 'inherit': 2}}
            className={`${buttonClass} filledButton`}
            disabled={props.disable}
          >
            {!showLoader && props.buttonTwoTitle}
            {showLoader && <DotDotLoaderNew
            styleBounce={{backgroundColor:'white'}}
            />}
          </Button>
        </div>
      );
    }
    if (props.twoButton) {
      return (
        <div className="FlexButton">
          <Button
            onClick={props.handleClickOne}
            fullWidth={false}
            variant="raised"
            size="large"
            className={`${buttonClass} borderButton`}
            style={{color: getConfig().secondary, borderColor: getConfig().secondary,
            flex: !getConfig().isMobileDevice ? 'inherit': 2}}
            disabled={props.disable}
          >
              <SVG
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=' + getConfig().secondary)}
              src={download}
            /> 
            {props.buttonOneTitle}
          </Button>
          <Button
            onClick={props.handleClickTwo}
            fullWidth={false}
            variant="raised"
            size="large"
            color="secondary"
            className={`${buttonClass} filledButton`}
            disabled={props.disable}
          >
            {props.buttonTwoTitle}
          </Button>
        </div>
      );
    } else {
      return (
        // <div>
          <Button
            fullWidth={(props.reset || props.type === 'summary') ? true : false}
            variant="raised"
            size="large"
            color="secondary"
            style={props.style}
            className={`${buttonClass} ${typeToClass[props.type || ''] || ''}`}
            classes={classes}
            disabled={props.buttonDisabled || props.disable}
            onClick={props.onClick}
          >
            {!showLoader && props.buttonTitle}
            {showLoader && 
            <DotDotLoaderNew
              styleBounce={{backgroundColor:'white'}}
            />}
            {
              props.arrow &&
              <img alt="" src={arrow} width={20} className="FooterButtonArrow" />
            }
          </Button>
        // </div>
      );
    }
    
  }
}

const styles = {
  button: {
    padding: !getConfig().isMobileDevice ? '12px 15px 12px 15px !important' : '16px !important',
    borderRadius: getConfig().uiElements?.bottomCta?.borderRadius || 6,
    boxShadow: 'none',
    width: !getConfig().isMobileDevice ? 'auto' :  '100%'
  },
  label: {
    fontFamily: 'Rubik',
    fontSize: '12px !important',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}

export default withStyles(styles)(CustomButton);