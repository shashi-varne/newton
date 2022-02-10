import { Stack } from '@mui/material';
import React from 'react';
import Typography from '../../designSystem/atoms/Typography';
import intervalToDuration from 'date-fns/intervalToDuration';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { nonRoundingToFixed } from '../../utils/validators';

function calculateFullAge(dob) {
  const startDate = parse(dob, 'dd/MM/yyyy', new Date());
  const { years, months, days } = intervalToDuration({ start: startDate, end: new Date() });
  return { years, months, days };
}

const calculateFundAge = (fundAge) => {
  const fundDay = fundAge?.days || 0;
  const fundMonth = fundAge?.months || 0;
  const fundYear = fundAge?.years || 0;
  if (fundYear > 0) {
    const hasMonthOrDay = fundMonth > 0 || fundDay > 0;
    if (hasMonthOrDay) {
      return `${fundYear}+ yrs`;
    } else {
      return `${fundYear} yrs`;
    }
  } else if (fundMonth > 0) {
    const hasDay = fundDay > 0;
    if (hasDay) {
      return `${fundMonth}+ mnths`;
    } else {
      return `${fundMonth} mnths`;
    }
  } else {
    if (fundDay > 0) {
      return `${fundDay}+ days`;
    } else {
      return `${fundDay} days`;
    }
  }
};

const FundStats = ({ fundData = {} }) => {
  const fullAgeData = calculateFullAge(fundData?.additional_info?.launch_date);
  const fundAge = calculateFundAge(fullAgeData);
  const launchDate = format(parse(fundData?.additional_info?.launch_date, 'dd/MM/yyyy', new Date()),'MMM d, yyyy');
  console.log('launch date is', launchDate);
  return (
    <Stack sx={{ mt: 4, mb: 3 }} spacing={3}>
      <Typography variant='heading3'>Fund stats</Typography>
      <Stack direction='row' justifyContent='space-between'>
        <Stack spacing='4px' direction='column'>
          <Typography allCaps variant='body9' color='foundationColors.content.secondary'>
            Fund Age
          </Typography>
          <Stack direction='column'>
            <Typography variant='heading4'>{fundAge}</Typography>
            <Typography variant='body5' color='foundationColors.content.secondary'>
              {`since ${launchDate}`}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing='4px' direction='column'>
          <Typography
            allCaps
            variant='body9'
            align='right'
            color='foundationColors.content.secondary'
          >
            Total Aum
          </Typography>
          <Typography variant='heading4' align='right'>
            {`₹ ${fundData?.performance?.aum}`}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction='row' justifyContent='space-between'>
        <Stack spacing='4px' direction='column'>
          <Typography allCaps variant='body9' color='foundationColors.content.secondary'>
            Expense ratio
          </Typography>
          <Typography variant='heading4'>{`${fundData?.portfolio?.expense_ratio}%`}</Typography>
        </Stack>
        <Stack spacing='4px' direction='column'>
          <Typography
            align='right'
            allCaps
            variant='body9'
            color='foundationColors.content.secondary'
          >
            Lock-in
          </Typography>
          <Typography align='right' variant='heading4'>
            NA
          </Typography>
        </Stack>
      </Stack>

      <Stack direction='column' spacing='4px'>
        <Typography variant='body9' allCaps color='foundationColors.content.secondary'>
          Exit load
        </Typography>
        {fundData?.additional_info?.exit_load?.map((exitLoadData, idx) => {
          return (
            <div key={idx}>
              <Typography variant='heading4' allCaps>
                {`${nonRoundingToFixed(exitLoadData?.value, 2)}${exitLoadData?.unit}`}
              </Typography>
              <Typography
                component='span'
                variant='body5'
                color='foundationColors.content.secondary'
              >
                {` (${exitLoadData?.period})`}
              </Typography>
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default FundStats;
