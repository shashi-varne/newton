/*
    The Purpose of introducing a new Wrapper component was to give support of:
     - elevation, noBorder and with Border style as per the elevation in foundation.
     - elevation => The component is clickable.
     - border => The component is not clickable.
     - noBorder => component which does not have Surface/Container will be clickable.

     Currently we have only two elevation variation => [0,1]. => 0 means no elevation.
     NOTE: 1. here the number does not represent the depth of the elevation,
              but it tells the version of elevation that design team provides to us.
              Currently, only a single version is there, which will be represented by 1.
           2. Any new version of elevation has to be added in the theme/shadows file.
*/

import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const WrapperBox = ({ elevation, children, noBorder, sx = {}, ...restProps }) => {
  const sxStyle = customSxStyle(elevation, noBorder);
  return (
    <Box sx={{ ...sxStyle, ...sx }} component='div' {...restProps}>
      {children}
    </Box>
  );
};

const customSxStyle = (elevation, noBorder) => {
  if (elevation) {
    return { 
      boxShadow: elevation.toString(),
      cursor: 'pointer'
    };
  } else if (noBorder) {
    return {
      border: 'none',
      cursor: 'pointer'
    };
  } else {
    return {
      border: '1px solid',
      borderColor: 'foundationColors.supporting.athensGrey',
      pointerEvents: 'none',
    };
  }
};

WrapperBox.defaultProps = {
  elevation: 0,
};

WrapperBox.propTypes = {
  elevation: PropTypes.oneOf([0, 1]),
  noBorder: PropTypes.bool,
  sx: PropTypes.object
};

export default WrapperBox;
