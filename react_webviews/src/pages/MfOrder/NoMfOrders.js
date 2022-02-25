import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Typography from '../../designSystem/atoms/Typography';
import Lottie from 'lottie-react';
import { getConfig } from '../../utils/functions';

const NoMfOrders = () => {
  const { productName } = getConfig();
  return (
    <Stack sx={{ height: '70vh' }} spacing='12px' alignItems='center' justifyContent='center'>
      <Box sx={{ width: '140px', height: '120px' }}>
        <Lottie
          animationData={require(`assets/${productName}/lottie/no_mf_order.json`)}
          autoPlay
          loop
        />
      </Box>
      <Typography align='center'>Please add at least one fund to make an investment</Typography>
    </Stack>
  );
};

export default NoMfOrders;
