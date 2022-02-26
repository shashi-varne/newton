import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Typography from '../../designSystem/atoms/Typography';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import EstimationCard from '../../designSystem/molecules/EstimationCard';
import ComparisonChart from './ComparisonChart';
import { formatAmountInr } from '../../utils/validators';
import isEmpty from 'lodash/isEmpty';
import { getFundData } from 'businesslogic/dataStore/reducers/fundDetails';

const ReturnComparison = () => {
  const [isRetunCompOpen, setIsRetunCompOpen] = useState(false);
  const investedAmount = useSelector(state => state?.fundDetails?.investedAmount);
  const expectedAmount = useSelector(state => state?.fundDetails?.expectedAmount);
  const investmentPeriod = useSelector(state => state?.fundDetails?.investmentPeriod);
  const expectedReturnPerc = useSelector(state => state?.fundDetails?.expectedReturnPerc);
  const fundData = useSelector(getFundData);
  const isReturnAvailable = isEmpty(fundData?.performance?.returns);

  const handleReturnCompSection = () => {
    setIsRetunCompOpen(!isRetunCompOpen);
  };
  return (
    <Box sx={{ mt: 4 }}>
      <CollapsibleSection
        isOpen={isRetunCompOpen}
        onClick={handleReturnCompSection}
        label={`Return comparison ${isReturnAvailable ? '(N/A)' : ''}`}
        disabled={isReturnAvailable}
      >
        <Box>
          <Stack direction='column' spacing={3}>
            <Stack direction='row' spacing={1}>
              <Typography variant='body2' color='foundationColors.content.secondary'>
                Investment amount:
              </Typography>
              <Typography variant='heading4'>{formatAmountInr(investedAmount)}</Typography>
            </Stack>
            <div>
              <ComparisonChart />
            </div>
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
                  leftTitle={`Estimated return in ${investmentPeriod}Y`}
                  leftSubtitle='Return %'
                  rightTitle={`${formatAmountInr(expectedAmount)}`}
                  rightSubtitle={`${expectedReturnPerc > 0 ? '+':'-'}${expectedReturnPerc}%`}
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
