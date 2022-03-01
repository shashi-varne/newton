import { Stack } from '@mui/material';
import React, { useMemo } from 'react';
import Filter from '../../../designSystem/molecules/Filter';

const FilterNavigation = ({
  returnLabel,
  disabled,
  handleSortClick,
  handleFilterClick,
  handleReturnClick,
  filterCount,
}) => {
  const isDisabledStyle = useMemo(() => {
    if (disabled) {
      return {
        opacity: 0.6,
        pointerEvents: 'none',
      };
    } else {
      return {};
    }
  }, [disabled]);
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{
        boxShadow: '1',
        bgcolor: 'foundationColors.supporting.white',
        ...isDisabledStyle,
      }}
    >
      <Filter
        title='Sort'
        onClick={handleSortClick}
        imgSrc={require('assets/union.svg')}
        dataAid='1'
      />
      <Filter
        title='Filter'
        onClick={handleFilterClick}
        imgSrc={require('assets/filter.svg')}
        filterCount={filterCount}
        dataAid='2'
      />
      <Filter
        title={`${returnLabel} returns`}
        onClick={handleReturnClick}
        imgSrc={require('assets/duration.svg')}
        dataAid='3'
      />
    </Stack>
  );
};

export default FilterNavigation;
