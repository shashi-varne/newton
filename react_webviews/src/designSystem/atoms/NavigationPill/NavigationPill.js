/*
  Props Description: 
  labelColor, backgroundColor => strongly recommended to use foundation colors only for these props.
  Example:
  labelColor: 'foundationColors.secondary.mango.300'
*/

import { Tab } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const NavigationPill = ({
  label,
  onClick,
  disabled,
  labelColor,
  backgroundColor,
}) => {
  const navigationSxStyle = {
    color: labelColor,
    backgroundColor,
  };
  return (
    <Tab
      label={label}
      disabled={disabled}
      type='navigationPill'
      onClick={onClick}
      sx={navigationSxStyle}
    />
  );
};

NavigationPill.propTypes = {
  label: PropTypes.string.isRequired
}

export default NavigationPill;
