import React from 'react';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';

export const NavigationHeaderPoints = ({ children, color, dataIdx }) => {
  return (
    <ul className='lh-description-list'>
      <li className='lh-description-item'>
        <Typography
          variant='body2'
          color={color}
          align='left'
          dataAid={`point${dataIdx}`}
          component='div'
        >
          {children}
        </Typography>
      </li>
    </ul>
  );
};

NavigationHeaderPoints.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired,
};

NavigationHeaderPoints.defaultProps = {
  color: 'foundationColors.content.secondary',
};
