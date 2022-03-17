import { IconButton, Skeleton, Stack } from '@mui/material';
import React from 'react';
import Icon from '../../designSystem/atoms/Icon';
import Separator from '../../designSystem/atoms/Separator';
import WrapperBox from '../../designSystem/atoms/WrapperBox';

const MFSkeletonLoader = ({ isProductFisdom }) => {
  return (
    <WrapperBox sx={{ p: 2 }} className='mf-investment-card-wrapper'>
      {isProductFisdom && (
        <IconButton className='mf-ic-close'>
          <Icon src={require('assets/close_grey.svg')} size='24px' />
        </IconButton>
      )}
      <Stack>
        <Stack direction='row' spacing={2}>
          <Icon size='32px' />
          <Skeleton type='text' width='60%' />
        </Stack>
        <Separator marginTop='16px' marginBottom='16px' />
        <Stack direction='row' spacing={2} justifyContent='space-between'>
          <Stack direction='column'>
            <Skeleton type='text' width='50px' />
            <Skeleton type='text' width='20px' />
          </Stack>
          <Skeleton type='text' width='40%' height='38px' />
        </Stack>
        <Separator marginTop='16px' marginBottom='16px' />
        <Stack direction='row' spacing={2} justifyContent='space-between'>
          <Stack direction='column'>
            <Skeleton type='text' width='50px' />
            <Skeleton type='text' width='20px' />
          </Stack>
          <Skeleton type='text' width='40%' height='38px' />
        </Stack>
      </Stack>
    </WrapperBox>
  );
};

export default MFSkeletonLoader;
