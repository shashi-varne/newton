import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import logo from '../assets/hdfc_insurance_small_logo.png';
import arrow from '../assets/next_arrow.png';

const Footer = (props) => (
  <div className={props.classes.footer}>
    <div className={props.classes.flex}>
      <div className={props.classes.flexItem} style={{flex: 1}}>
        <img src={logo} className={props.classes.image}/>
      </div>
      <div className={props.classes.flexItem} style={{flex: 2}}>
        <Button fullWidth={true} variant="raised" size="large" color="secondary" className={props.classes.button}>
          Save & Continue <img src={arrow} width={20} className={props.classes.arrow}/>
        </Button>
      </div>
    </div>
  </div>
);

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
    top: 2
  },
  arrow: {
    marginLeft: 20
  },
  button: {
    padding: '17px 24px',
    borderRadius: 0,
    textTransform: 'capitalize',
    fontSize: '1.2rem'
  }
};

export default withStyles(styles)(Footer);
