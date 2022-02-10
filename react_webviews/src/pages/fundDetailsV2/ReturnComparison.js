import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import Typography from '../../designSystem/atoms/Typography';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import EstimationCard from '../../designSystem/molecules/EstimationCard';

const ReturnComparison = () => {
  const [isRetunCompOpen, setIsRetunCompOpen] = useState(false);
  const handleReturnCompSection = () => {
    setIsRetunCompOpen(!isRetunCompOpen);
  };
  return (
    <Box sx={{ mt: 4 }}>
      <CollapsibleSection
        isOpen={isRetunCompOpen}
        onClick={handleReturnCompSection}
        label='Return comparison'
      >
        <Box>
          <Stack direction='column' spacing={3}>
            <Stack direction='row' spacing={1}>
              <Typography variant='body2' color='foundationColors.content.secondary'>
                Investment amount:
              </Typography>
              <Typography variant='heading4'>₹10,51,220</Typography>
            </Stack>
            <Box
              sx={{
                width: '100%',
                height: '153px',
                backgroundColor: 'foundationColors.primary.200',
              }}
            />
            <Stack direction='row' spacing={2}>
              <Typography variant='body5' color='foundationColors.content.secondary'>
                Principal invested
              </Typography>
              <Typography variant='body5' color='foundationColors.content.secondary'>
                Returns gained
              </Typography>
            </Stack>
            <Stack direction='column' spacing={2} sx={{ pb: 3 }}>
              <WrapperBox elevation={1}>
                <EstimationCard
                  leftTitle='Estimated return'
                  leftSubtitle='Return %'
                  rightTitle='₹11,60,600.00'
                  rightSubtitle='+116.06%'
                  rightSubtitleColor='foundationColors.secondary.profitGreen.400'
                />
              </WrapperBox>
              <Typography variant='body5' color='foundationColors.content.secondary'>
                Note: Savings account & fixed deposit can at max give an average return of 6%
                annually
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </CollapsibleSection>
    </Box>
  );
};

export default ReturnComparison;
