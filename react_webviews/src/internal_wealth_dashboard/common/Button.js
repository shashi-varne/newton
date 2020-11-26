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
      style={props.style}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export const WhiteButton = withStyles({
  root: {
    textTransform: 'uppercase',
  },
  raised: {
    boxShadow: 'none',
    borderRadius: '4px',
    padding: isMobileView ? '8px' : '13px 19px',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
      opacity: 0.9,
    },
    minHeight: '50px',
  },
  disabled: {
    backgroundColor: 'white !important',
    opacity: 0.8,
  },
  label: {
    color: 'var(--primary)',
    textAlign: 'center',
    fontSize: isMobileView ? '12px' : '15px',
    lineHeight: '24px',
    letterSpacing: 'normal',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
})(NewButton);

export const PrimaryButton = withStyles({
  root: {
    textTransform: 'uppercase',
  },
  raised: {
    boxShadow: 'none',
    borderRadius: '4px',
    padding: isMobileView ? '8px' : '13px 19px',
    backgroundColor: '#4F2DA6',
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
    textAlign: 'center',
    fontSize: isMobileView ? '12px' : '15px',
    lineHeight: '24px',
    letterSpacing: 'normal',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
})(NewButton);