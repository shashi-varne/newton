import { Slide } from '@mui/material';
import React from 'react';

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export const dialogStylesOverride = () => {
  return {
    paper: customPaperStyling,
  };
};

const customPaperStyling = (props) => {
  if (props?.ownerState?.variant === 'bottomsheet') {
    return {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      borderRadius: 12,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    };
  }
};

export const dialogDefaultProps = () => {
  return {
    TransitionComponent: SlideTransition,
  };
};
