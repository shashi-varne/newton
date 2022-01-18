/*
  prop description:
  leftSectionProps, middleSectionProps, rightSectionProps:
    - The structure for the above props is:
      {
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        countColor: PropTypes.string,
        imgProps: PropTypes.object,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        titleColor: PropTypes.string,
        badgeColor: PropTypes.string,
        onClick: PropTypes.func,
    };
  Note: strongly recommended to pass only foundation color for the color related props.
  Example: badgeColor: 'foundationColors.secondary.profitGreen.300'
*/

import React, { useMemo } from 'react';
import Typography from '../../atoms/Typography';
import Box from '@mui/material/Box';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './Filter.scss';

const Filter = ({
  leftImgSrc,
  leftImgProps = {},
  rightImgSrc,
  rightImgProps = {},
  title,
  titleColor,
  dataAid,
  badgeColor,
  count,
  countColor,
  onClick,
}) => {
  return (
    <div className='filter-wrapper' onClick={onClick}>
      {leftImgSrc && (
        <Imgc
          src={leftImgSrc}
          style={{ width: '16px', height: '16px', marginRight: '8px' }}
          {...leftImgProps}
        />
      )}
      <Typography variant='body2' color={titleColor} component='div'>
        {title}
      </Typography>
      {rightImgSrc && (
        <Imgc
          src={rightImgSrc}
          style={{ width: '16px', height: '16px', marginRight: '8px' }}
          {...rightImgProps}
        />
      )}
      {count && (
        <Box
          sx={{
            backgroundColor: badgeColor,
          }}
          className='filter-nav-badge'
        >
          <Typography variant='body4' color={countColor} className='filter-nav-badge-text'>
            {count}
          </Typography>
        </Box>
      )}
    </div>
  );
};

Filter.defaultProps = {
  badgeColor: 'foundationColors.secondary.lossRed.400',
};
export default Filter;
