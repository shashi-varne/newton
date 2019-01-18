import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import arrow from 'assets/next_arrow.png';

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
          disabled={props.isDisabled}
          className={props.classes.button} >
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
    padding: '16px 24px',
    borderRadius: 0,
    textTransform: 'capitalize',
    fontSize: '16px',
    boxShadow: 'none',
    width: '100%'
  }
}

export default withStyles(styles)(CustomButton);
