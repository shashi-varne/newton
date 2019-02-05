import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import arrow from 'assets/next_arrow.png';
import './style.css';

class CustomButton extends Component {
  render() {
    const props = this.props;
    return (
      <div>
        <Button
          fullWidth={(props.reset || props.type === 'summary') ? true : false}
          variant="raised"
          size="large"
          color="secondary"
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

const styles = {
  button: {
    padding: '16px 24px !important',
    borderRadius: 7,
    textTransform: 'capitalize',
    fontSize: '16px !important',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
    width: '100% !important'
  }
}

export default withStyles(styles)(CustomButton);
