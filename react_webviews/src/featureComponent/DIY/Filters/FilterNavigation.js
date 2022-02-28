import { Stack } from '@mui/material';
import React from 'react';
import Filter from '../../../designSystem/molecules/Filter';

const FilterNavigation = ({returnLabel, handleSortClick, handleFilterClick, handleReturnClick, filterCount}) => {
  return (
    <Stack direction='row' justifyContent='space-between' sx={{boxShadow:'1', bgcolor: 'foundationColors.supporting.white', m: '0px -16px !important'}}>
      <Filter title='Sort' onClick={handleSortClick} imgSrc={require('assets/union.svg')} dataAid="1" />
      <Filter title='Filter' onClick={handleFilterClick} imgSrc={require('assets/filter.svg')} filterCount={filterCount} dataAid="2" />
      <Filter title={`${returnLabel} returns`} onClick={handleReturnClick} imgSrc={require('assets/duration.svg')} dataAid="3" />
    </Stack>
  );
};

export default FilterNavigation;
