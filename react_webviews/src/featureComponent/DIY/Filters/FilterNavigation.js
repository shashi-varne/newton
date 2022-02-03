import { Stack } from '@mui/material';
import React from 'react';
import Filter from '../../../designSystem/molecules/Filter';

const FilterNavigation = ({handleSortClick, handleFilterClick, handleReturnClick}) => {
  return (
    <Stack direction='row' justifyContent='space-between' sx={{boxShadow:'1'}}>
      <Filter title='Sort' onClick={handleSortClick} imgSrc={require('assets/amazon_pay.svg')}/>
      <Filter title='Filter' onClick={handleFilterClick} imgSrc={require('assets/amazon_pay.svg')} count={2}/>
      <Filter title='3Y returns' onClick={handleReturnClick} imgSrc={require('assets/amazon_pay.svg')}/>
    </Stack>
  );
};

export default FilterNavigation;
