import { Divider, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { getConfig } from '../../../utils/functions';
import Typography from '../Typography';

const Contact = () => {
  const { mobile, email } = useMemo(getConfig, []);
  return (
    <Stack spacing='4px' justifyContent='center' alignItems='center'>
      <Typography variant='body2' color='foundationColors.content.secondary'>
        For any query, reach us at
      </Typography>

      <Stack
        direction='row'
        divider={
          <Divider
            sx={{ color: 'foundationColors.supporting.athensGrey' }}
            orientation='vertical'
            flexItem
          />
        }
        spacing={2}
        alignItems='center'
      >
        <Typography variant='body4' color='foundationColors.content.secondary'>
          {mobile}
        </Typography>
        <Typography variant='body4' color='foundationColors.content.secondary'>
          {email}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Contact;
