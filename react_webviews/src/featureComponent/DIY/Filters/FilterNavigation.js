import { Stack } from '@mui/material';
import React from 'react';
import Filter from '../../../designSystem/molecules/Filter';

const FilterNavigation = ({returnLabel, handleSortClick, handleFilterClick, handleReturnClick, count}) => {
  return (
    <Stack direction='row' justifyContent='space-between' sx={{boxShadow:'1', backgroundColor: 'white'}}>
      <Filter title='Sort' onClick={handleSortClick} imgSrc={require('assets/amazon_pay.svg')}/>
      <Filter title='Filter' onClick={handleFilterClick} imgSrc={require('assets/amazon_pay.svg')} count={count} />
      <Filter title={`${returnLabel} returns`} onClick={handleReturnClick} imgSrc={require('assets/amazon_pay.svg')}/>
    </Stack>
  );
};

export default FilterNavigation;
