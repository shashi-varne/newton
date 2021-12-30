import { Box, Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import './LandingHeader.scss';

const LandingHeader = () => {
  return (
    <Box className='landing-header-wrapper'>
      <Imgc src={require(`assets/dummy_landing_header.svg`)} style={{width:'140px', height:'120px'}}/>
      <Typography variant='heading1'>Title</Typography>
      <Typography variant='body2' color='foundationColors.content.secondary'>
        These funds essentially invest in stocks of various two line text, limit
        - 99 characters or 17 words
      </Typography>
    </Box>
  );
};

export default LandingHeader;
