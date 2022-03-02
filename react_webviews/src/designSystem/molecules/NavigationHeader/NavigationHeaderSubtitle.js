import React from 'react';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';

export const NavigationHeaderSubtitle = ({ children, color, dataIdx }) => {
  return (
    <Typography
      className='lh-subtitle'
      dataAid={`subtitle${dataIdx}`}
      variant='body2'
      color={color}
      align='left'
      component='div'
    >
      {children}
    </Typography>
  );
};

NavigationHeaderSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired,
};

NavigationHeaderSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};
