/*
  Props Description: 
  label: this is a required prop.
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
  dataAid
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
      data-aid={`navigationPill_${dataAid}`}
    />
  );
};

NavigationPill.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  labelColor: PropTypes.string,
  backgroundColor: PropTypes.string,
}

export default NavigationPill;
