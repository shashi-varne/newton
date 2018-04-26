import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import logo from '../assets/hdfc_insurance_small_logo.png';
import arrow from '../assets/next_arrow.png';

const FullWidthButton = (props) => (
  <Button fullWidth={true} variant="raised" size="large" color="secondary" className={props.classes.button} onClick={props.handleClick}>
    {props.buttonTitle} {props.arrow && <img alt="" src={arrow} width={20} className={props.classes.arrow}/>}
  </Button>
);

const DefaultButton = (props) => {
  if (props.edit) {
    return (
      <FullWidthButton {...props} arrow={false}/>
    );
  } else {
    return (
      <div className={props.classes.flex}>
        <div className={props.classes.flexItem} style={{flex: 1}}>
          <img alt="" src={logo} className={props.classes.image}/>
        </div>
        <div className={props.classes.flexItem} style={{flex: 2}}>
          <FullWidthButton {...props} arrow={true}/>
        </div>
      </div>
    );
  }
};

const SummaryButton = (props) => (
  <div className={props.classes.flex}>
    <div style={{flex: 3, padding: '5px 0 0 10px'}}>
      <div style={{color: '#444', fontSize: 12}}>Premium</div>
      <div style={{color: '#444', fontSize: 14, fontWeight: 500, fontFamily: 'Roboto'}}>₹ {props.premium} {props.paymentFrequency}</div>
      {(props.paymentFrequency === 'MONTHLY') && <div style={{color: '#878787', fontSize: 10}}>*You’ve to pay <b>3 months premiums</b>.</div>}
    </div>
    <div style={{flex: 1}}>
      <Button variant="raised" size="large" color="secondary"  style={{borderRadius: 5, margin: 5}} className={props.classes.button} onClick={props.handleClick}>
        Pay Now
      </Button>
    </div>
  </div>
);

const Footer = (props) => {
  if (props.fullWidthButton) {
    return (
      <div className={`Footer ${props.classes.footer}`}>
        <SummaryButton {...props}/>
      </div>
    );
  } else {
    return (
      <div className={`Footer ${props.classes.footer}`}>
        <DefaultButton {...props} />
      </div>
    );
  }
};

const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: '1px solid rgba(0,0,0,0.14)'
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    marginTop: -1
  },
  flexItem: {
    textAlign: 'center'
  },
  image: {
    width: '90%',
    position: 'relative',
    top: 3
  },
  arrow: {
    marginLeft: 20
  },
  button: {
    padding: '16px 24px',
    borderRadius: 0,
    textTransform: 'capitalize',
    fontSize: '16px',
    boxShadow: 'none'
  }
};

export default withStyles(styles)(Footer);
