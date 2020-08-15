import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from 'material-ui';

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
    borderRadius: '6px',
    padding: '12px 19px',
  },
  raised: {
    boxShadow: 'none',
    backgroundColor: 'var(--primary)',
    '&:hover': {
      backgroundColor: 'var(--primary)',
      opacity: 0.9,
    },
  },
  label: {
    color: 'white',
    fontSize: '17px',
    letterSpacing: 'normal',
    textTransform: 'inherit',
    fontWeight: 'normal',
  },
})(NewButton);

export default WrButton;