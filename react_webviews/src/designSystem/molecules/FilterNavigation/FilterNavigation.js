import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import { Badge } from '@mui/material';

import './FilterNavigation.scss';

const FilterNavigation = ({
  leftSectionProps = {},
  middleSectionProps = {},
  rightSectionProps = {},
}) => {
  const combinedValues = useMemo(() => {
    return [leftSectionProps, middleSectionProps, rightSectionProps];
  }, []);
  return (
    <div className='filter-nav-wrapper'>
      <div className='filter-nav-list'>
        {combinedValues?.map((sectionProps, idx) => {
          const {
            imgSrc = '',
            count = '',
            imgProps = {},
            title = '',
            badgeColor='foundationColors.secondary.lossRed.400',
            onClick
          } = sectionProps;
          return (
            <div className='filter-nav-item' key={idx} onClick={onClick}>
              <Imgc
                src={imgSrc}
                style={{ width: '16px', height: '16px', marginRight: '8px' }}
                {...imgProps}
              />
              <Typography variant='body2'>{title}</Typography>
              <div className='filter-nav-badge-wrapper'>
                <Badge
                  invisible={!count}
                  badgeContent={count}
                ></Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterNavigation;
