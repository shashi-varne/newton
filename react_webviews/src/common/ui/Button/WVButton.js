import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { getConfig } from '../../../utils/functions';
import DotDotLoaderNew from '../DotDotLoaderNew';
import { disableBodyTouch } from '../../../utils/validators';

const noop = () => {};

const WVButton = ({
  dataAidSuffix,
  contained, // boolean to set variant="contained"
  outlined, // boolean to set variant="outlined"
  showLoader, // boolean to show in-button loader
  onClick,
  children,
  ...props // remaining button props as per MUI
}) => {
  const variant = props.variant || (contained ? 'contained' : outlined ? 'outlined' : 'text');

  if (showLoader) {
    disableBodyTouch(); //disable touch
  } else {
    disableBodyTouch(true); //touch enabled
  }

  return (
    <Button
      {...props}
      variant={variant}
      onClick={showLoader ? noop : onClick}
      data-aid={`wv-button-${dataAidSuffix}`}
    >
      {showLoader ?
        <DotDotLoaderNew
          styleBounce={{
            backgroundColor: props.variant === 'contained' ? 'white' : '#35cb5d'
          }}
        /> :
        children
      }
    </Button>
  );
}

const styles = {
  root: {
    padding: !getConfig().isMobileDevice ? '12px 15px 12px 15px !important' : '16px !important',
    borderRadius: getConfig().uiElements.button.borderRadius,
    textTransform: 'uppercase',
    fontSize: '12px !important',
    boxShadow: 'none',
    fontWeight: 'bold',
    letterSpacing: '1px',
    display: !getConfig().isMobileDevice ? 'flex' : 'inline-flex', 
    width: !getConfig().isMobileDevice ? 'auto' : '100%'
  },
  label: {
    fontFamily: 'Rubik',
    fontSize: '12px !important',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}

export default withStyles(styles)(WVButton);