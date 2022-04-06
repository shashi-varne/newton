import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { getConfig } from '../../../utils/functions';
import DotDotLoaderNew from '../DotDotLoaderNew';
import { getDataAid } from '../../../utils/validators';

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

  return (
    <Button
      {...props}
      variant={variant}
      onClick={showLoader ? noop : onClick}
      data-aid={getDataAid('button', dataAidSuffix || (variant === 'outlined' ? 'secondary' : 'primary'))}
    >
      {showLoader ?
        <DotDotLoaderNew
          styleBounce={{
            backgroundColor: props.variant === 'contained' ? 'white' : '#35cb5d'
          }}
        /> :
        <div data-aid={getDataAid('tv', 'text')}>{children}</div>
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