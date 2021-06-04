import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { getConfig } from '../../../utils/functions';
import DotDotLoaderNew from '../DotDotLoaderNew';
import { disableBodyTouch } from '../../../utils/validators';

const WVButton = ({ showLoader, children,  dataAid, ...props  }) => {
  if (showLoader) {
    disableBodyTouch(); //disable touch
  } else {
    disableBodyTouch(true); //touch enabled
  }

  return (
    <Button {...props} data-aid={dataAid}>
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
    padding: !getConfig().isMobileDevice ? '12px 15px 12px 15px !important' : '16px 0px !important',
    borderRadius: 6,
    textTransform: 'uppercase',
    fontSize: '12px !important',
    boxShadow: 'none',
    fontWeight: 'bold',
    letterSpacing: '1px',
    display: !getConfig().isMobileDevice ? 'flex' : 'inline-flex', 
    width: !getConfig().isMobileDevice ? 'auto' : '100%'
  },
  label: {},
}

export default withStyles(styles)(WVButton);