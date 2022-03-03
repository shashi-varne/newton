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
      <Icon src={require('assets/trust_icon_secure.svg')} dataAid="sebi" />
    </Stack>
  );
};

export default SecureIcon;
