import React from 'react';
import LibTypography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const Typography = ({ allCaps, children, dataAid, ...restProps }) => {
  return (
    <LibTypography allcaps={allCaps ? 1 : 0} data-aid={`tv_${dataAid}`} {...restProps}>
      {children}
    </LibTypography>
  );
};

Typography.propTypes = {
  dataAid : PropTypes.string,
  allCaps: PropTypes.bool
}

export default Typography;
