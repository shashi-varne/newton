import React from 'react';
import LibTypography from '@mui/material/Typography';

const Typography = ({ allCaps, children, ...restProps }) => {
  return (
    <LibTypography allcaps={allCaps ? 1 : 0} {...restProps}>
      {children}
    </LibTypography>
  );
};

export default Typography;
