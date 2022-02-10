import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import BarMeter from '../../designSystem/atoms/BarMeter';
import Separator from '../../designSystem/atoms/Separator';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';

const barData = [
  {
    name: 'Low',
    value: 1,
  },
  {
    name: 'Below Average',
    value: 2,
    hide: true,
  },
  {
    name: 'Medium',
    value: 3,
    hide: true,
  },
  {
    name: 'Above Average',
    value: 4,
    hide: true,
  },
  {
    name: 'High',
    value: 5,
  },
];

const barMeterData = (riskValue) => {
  // eslint-disable-next-line no-unused-expressions
  const newBarData = barData?.map((el, idx) => {
    if (idx === 0 || idx === barData?.length - 1) return el;
    if (el.name.toLowerCase() === riskValue.toLowerCase()) {
      el.hide = false;
      return el;
    } else {
      el.hide = true;
      return el;
    }
  });
  return newBarData;
};

const getBarIndex = (riskValue) => {
  const riskIndex = barData?.findIndex((el) => el.name.toLowerCase() === riskValue.toLowerCase());
  return riskIndex;
};

const RiskDetails = ({ fundData }) => {
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const handleRiskAction = () => {
    setIsRiskOpen(!isRiskOpen);
  };
  return (
    <Box sx={{ mt: 4 }}>
      <CollapsibleSection label='Risk details' isOpen={isRiskOpen} onClick={handleRiskAction}>
        <Box>
          <Stack direction='column' spacing={3}>
            <Stack direction='column' spacing={3}>
              <Typography>Risk vs Category</Typography>
              <BarMeter
                barMeterData={barMeterData(fundData?.risk?.risk_vs_category)}
                activeIndex={getBarIndex(fundData?.risk?.risk_vs_category)}
              />
            </Stack>
            <Stack direction='column' spacing={3}>
              <Typography>Return vs Category</Typography>
              <BarMeter
                barMeterData={barMeterData(fundData?.risk?.return_vs_category)}
                activeIndex={getBarIndex(fundData?.risk?.return_vs_category)}
              />
            </Stack>
          </Stack>

          <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
            <Typography variant='heading4'>Risk measures</Typography>
            {fundData?.risk?.risk_measures?.map((riskMeasure, idx) => {
              return (
                <Stack key={idx} direction='column' spacing={2}>
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography variant='body8' color='foundationColors.content.secondary'>
                      {riskMeasure?.name}
                    </Typography>
                    <Typography variant='heading4' color='foundationColors.content.secondary'>
                      + {riskMeasure?.value}%
                    </Typography>
                  </Stack>
                  <Separator />
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </CollapsibleSection>
    </Box>
  );
};

export default RiskDetails;
