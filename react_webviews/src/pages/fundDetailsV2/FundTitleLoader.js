import { Skeleton, Stack } from '@mui/material';
import React from 'react';
import Icon from '../../designSystem/atoms/Icon';
import Typography from '../../designSystem/atoms/Typography';

const FundTitleLoader = () => {
  const separatorList = [1, 1, 1];
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Icon size='40px' />
      <Stack direction='column'>
        <Skeleton width='200px' height='23px' />
        <Stack direction='row' alignItems='center'>
          {separatorList.map((el, idx) => {
            const hideSeparator = separatorList.length === idx + 1;
            return (
              <Stack direction='row' key={idx} alignItems='center'>
                <Skeleton width='40px' height='23px' />
                {!hideSeparator && (
                  <Typography
                    variant='body6'
                    color='foundationColors.supporting.cadetBlue'
                    sx={{ mx: 1 }}
                  >
                    |
                  </Typography>
                )}
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FundTitleLoader;
