import React, { useMemo } from 'react';
import Typography from '../Typography';
import Icon from '../Icon';
import { getConfig } from '../../../utils/functions';
import { Stack } from '@mui/material';

const SecureIcon = () => {
  let { productName } = useMemo(getConfig, []);
  productName = productName === 'finity' ? 'Finity' : 'Fisdom';
  return (
    <Stack justifyContent='center' alignItems='center' spacing={1}>
      <Typography variant='body5' color='foundationColors.content.secondary' dataAid="title" >
        Investments with {productName} are 100% secure
      </Typography>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} >
        <Icon src={require('assets/sebi.svg')} dataAid="sebi" />
        <Icon src={require('assets/secure.svg')} dataAid="lock" />
      </Stack>
    </Stack>
  );
};

export default SecureIcon;
