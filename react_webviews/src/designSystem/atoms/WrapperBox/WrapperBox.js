/*
    The Purpose of introducing a new Wrapper component was to give support of:
     - elevation, border(default)

     Currently we have only two elevation variation => [0,1]. => 0 means no elevation.
     NOTE: 1. here the number does not represent the depth of the elevation,
              but it tells the version of elevation that design team provides to us.
              Currently, only a single version is there, which will be represented by 1.
           2. Any new version of elevation has to be added in the theme/shadows file.
*/

import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { SHADOWS } from '../../../theme/shadows';
import isFunction from 'lodash/isFunction';

const WrapperBox = ({ elevation, children, sx = {}, className, onClick, ...restProps }) => {
  const sxStyle = customSxStyle(elevation, onClick);
  return (
    <Box
      sx={{ ...sxStyle, ...sx }}
      className={className}
      component='div'
      onClick={onClick}
      {...restProps}
    >
      {children}
    </Box>
  );
};

const customSxStyle = (elevation, onClick) => {
  if (elevation > 0 && SHADOWS[elevation]) {
    return {
      boxShadow: elevation.toString(),
      ...COMMON_WRAPPER_STYLE(onClick),
    };
  } else {
    return {
      border: `1px solid `,
      borderColor: 'foundationColors.supporting.athensGrey',
      ...COMMON_WRAPPER_STYLE(onClick),
    };
  }
};

const COMMON_WRAPPER_STYLE = (onClick) => {
  return {
    borderRadius: '12px',
    backgroundColor: 'foundationColors.supporting.white',
    cursor: isFunction(onClick) ? 'pointer' : 'default',
  };
};

WrapperBox.defaultProps = {
  elevation: 0,
};

WrapperBox.propTypes = {
  elevation: PropTypes.oneOf([0, 1]),
  sx: PropTypes.object,
  onClick: PropTypes.func,
};

export default WrapperBox;
