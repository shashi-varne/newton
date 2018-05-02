import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import arrow from '../assets/next_arrow.png';

const CustomButton = (props) => (
  <Button
    fullWidth={(props.reset || props.type === 'summary') ? true : false}
    variant="raised"
    size="large"
    color="secondary"
    className={props.classes.button}
    onClick={props.handleClick} >
    {props.buttonTitle}
    {
      props.arrow &&
      <img alt="" src={arrow} width={20} className="FooterButtonArrow"/>
    }
  </Button>
);

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
