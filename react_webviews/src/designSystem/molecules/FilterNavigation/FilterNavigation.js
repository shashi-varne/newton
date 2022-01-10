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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './FilterNavigation.scss';

const FilterNavigation = ({
  leftSectionProps,
  middleSectionProps,
  rightSectionProps,
  dataAid
}) => {
  const combinedValues = useMemo(() => {
    return [leftSectionProps, middleSectionProps, rightSectionProps];
  }, []);
  return (
    <div className='filter-nav-wrapper' data-aid={`filterNavigation_${dataAid}`}>
      {combinedValues?.map((sectionProps, idx) => {
        const {
          imgSrc = '',
          count = '',
          countColor = 'foundationColors.supporting.white',
          imgProps = {},
          title = '',
          titleColor,
          badgeColor = 'foundationColors.secondary.lossRed.400',
          onClick,
        } = sectionProps;
        return (
          <div className='filter-nav-item' key={idx} onClick={onClick}>
            <Imgc
              src={imgSrc}
              style={{ width: '16px', height: '16px', marginRight: '8px' }}
              {...imgProps}
            />
            <Typography variant='body2' color={titleColor} component='div' data-aid={`tv_title_${idx+1}`}>
              {title}
            </Typography>
            {count && (
              <Box
                sx={{
                  backgroundColor: badgeColor,
                }}
                className='filter-nav-badge'
              >
                <Typography
                  variant='body4'
                  color={countColor}
                  className='filter-nav-badge-text'
                >
                  {count}
                </Typography>
              </Box>
            )}
          </div>
        );
      })}
    </div>
  );
};

FilterNavigation.defaultProps = {
  leftSectionProps: {},
  middleSectionProps: {},
  rightSectionProps: {},
};

const SECTION_STRUCTURE_SHAPE = {
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  countColor: PropTypes.string,
  imgProps: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  badgeColor: PropTypes.string,
  onClick: PropTypes.func,
};

FilterNavigation.propTypes = {
  leftSectionProps: PropTypes.shape(SECTION_STRUCTURE_SHAPE),
  middleSectionProps: PropTypes.shape(SECTION_STRUCTURE_SHAPE),
  rightSectionProps: PropTypes.shape(SECTION_STRUCTURE_SHAPE),
};

export default FilterNavigation;
