import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Button } from 'material-ui';
import { getConfig } from "utils/functions";
const isMobileView = getConfig().isMobileDevice;

const NewButton = (props) => {
  const { root, raised, label } = props.classes || {};

  return (
    <Button
      variant={props.variant || 'raised'}
      fullWidth={props.fullWidth}
      classes={{ root, raised, label }}
      {...props}
    >
      {props.children}
    </Button>
  );
};

const WrButton = withStyles({
  root: {
    textTransform: 'capitalize',
  },
  raised: {
    boxShadow: 'none',
    borderRadius: '6px',
    padding: isMobileView ? '8px' : '12px 19px',
    backgroundColor: 'var(--primary)',
    '&:hover': {
      backgroundColor: 'var(--primary)',
      opacity: 0.9,
    },
  },
  disabled: {
    backgroundColor: 'var(--primary) !important',
    opacity: 0.6,
  },
  label: {
    color: 'white',
    fontSize: isMobileView ? '12px' : '17px',
    letterSpacing: 'normal',
    textTransform: 'capitalize',
    fontWeight: 'normal',
  },
})(NewButton);

export default WrButton;