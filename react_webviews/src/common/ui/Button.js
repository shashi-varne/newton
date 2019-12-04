import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import arrow from 'assets/next_arrow.png';
import download from 'assets/download.svg';
import SVG from 'react-inlinesvg';

import './style.css';
import { getConfig } from 'utils/functions';

class CustomButton extends Component {
  render() {
    const props = this.props;

    if (props.twoButton) {
      return (
        <div className="FlexButton">
          <Button
            onClick={props.handleClickOne}
            fullWidth={false}
            variant="raised"
            size="large"
            className={`${props.classes.button} borderButton`}
            style={{color: getConfig().secondary, borderColor: getConfig().secondary,
            flex: !getConfig().isMobileDevice ? 'inherit': 2}}
            disabled={props.disable} >
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
            className={`${props.classes.button} filledButton`}
            disabled={props.disable} >
            {props.buttonTwoTitle}
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            fullWidth={(props.reset || props.type === 'summary') ? true : false}
            variant="raised"
            size="large"
            color="secondary"
            style={{backgroundColor: getConfig().secondary}}
            className={props.classes.button}
            disabled={props.disable} >
            {props.buttonTitle}
            {
              props.arrow &&
              <img alt="" src={arrow} width={20} className="FooterButtonArrow" />
            }
          </Button>
        </div>
      );
    }
    
  }
}

const styles = {
  button: {
    padding: !getConfig().isMobileDevice ? '12px 15px 12px 15px !important' : '16px 0px !important',
    borderRadius: 6,
    textTransform: 'capitalize',
    fontSize: '16px !important',
    boxShadow: 'none',
    // boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
    width: !getConfig().isMobileDevice ? 'auto' : '100% !important'
  }
}

export default withStyles(styles)(CustomButton);
