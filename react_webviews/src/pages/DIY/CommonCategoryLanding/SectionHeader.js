import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import Button from '../../../designSystem/atoms/Button';
import Icon from '../../../designSystem/atoms/Icon';
import Typography from '../../../designSystem/atoms/Typography';
import { getConfig } from '../../../utils/functions';

const SectionHeader = ({ sx, isPageLoading, title, buttonTitle = 'See all', onClick }) => {
  const { productName } = getConfig();
  return (
    <Stack
      sx={sx}
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      flexBasis='100%'
    >
      <Typography sx={{ width: '100%' }} variant='heading4'>
        {isPageLoading ? <Skeleton width='140px' /> : title}
      </Typography>
      {isPageLoading ? (
        <Typography variant='actionText' sx={{ width: '100%' }}>
          <Skeleton width='50px' sx={{ ml: 'auto' }} />
        </Typography>
      ) : (
        onClick && (
          <Stack direction='row' alignItems='center' spacing='4px' onClick={onClick}>
            <Button title={buttonTitle} variant='link' />
            <Icon src={require(`assets/${productName}/right_arrow_small.svg`)} size='16px' />
          </Stack>
        )
      )}
    </Stack>
  );
};

export default SectionHeader;
