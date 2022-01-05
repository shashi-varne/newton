/*
  Props Description: 
  labelColor, backgroundColor => strongly recommended to use foundation colors only for these props.
  Example:
  labelColor: 'foundationColors.secondary.mango.300'
*/

import { Tab } from '@mui/material';
import React from 'react';

const NavigationPill = ({ label, onClick, disabled, labelColor, backgroundColor }) => {
  const navigationSxStyle = {
    color: labelColor,
    backgroundColor
  };
  return (
    <div>
      <Tab
        label={label}
        disabled={disabled}
        type='navigationPill'
        onClick={onClick}
        sx={navigationSxStyle}
      />
    </div>
  );
};

export default NavigationPill;
