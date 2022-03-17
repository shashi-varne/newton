import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import Typography from '../../designSystem/atoms/Typography';
import intervalToDuration from 'date-fns/intervalToDuration';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { nonRoundingToFixed } from '../../utils/validators';
import Tooltip from '../../designSystem/atoms/Tooltip';
import Icon from '../../designSystem/atoms/Icon';
import { useSelector } from 'react-redux';
import { getFundData } from 'businesslogic/dataStore/reducers/fundDetails';
import { isValidValue } from './helperFunctions';
import isEmpty from 'lodash/isEmpty';

function calculateFullAge(dob = '') {
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

const getLockinData = (lockinString) => {
  if (!lockinString) return {};
  const substr = lockinString.match(/(\w+.+)\s\(/);
  if (substr) {
    const substrEl = substr[1];
    const newData = substrEl.match(/(\d+.*)(or.*)/);
    const lockingPeriod = newData[1];
    const lockingAge = newData[2];
    return {
      lockingAge,
      lockingPeriod,
    };
  } else {
    return {
      lockingPeriod: lockinString,
      lockingAge: '',
    };
  }
};

const FundStats = () => {
  const fundData = useSelector(getFundData);
  const fullAgeData = calculateFullAge(fundData?.additional_info?.launch_date);
  const fundAge = calculateFundAge(fullAgeData);
  const launchDate = format(
    parse(fundData?.additional_info?.launch_date, 'dd/MM/yyyy', new Date()),
    'MMM d, yyyy'
  );

  const lokinPeriodData = getLockinData(fundData?.additional_info?.lockin_period);

  return (
    <Stack
      sx={{ bgcolor: 'foundationColors.supporting.white', p: '32px 16px 24px 16px' }}
      spacing={3}
    >
      <Typography variant='heading3' dataAid="fundStats">Fund stats</Typography>
      <Stack direction='row' justifyContent='space-between'>
        <Stack spacing='4px' direction='column'>
          <Typography allCaps variant='body9' color='foundationColors.content.secondary' dataAid="fundAgeKey" >
            Fund Age
          </Typography>
          <Stack direction='column' data-aid="tv_fundAgeValue" >
            <Typography variant='heading4'>{fundAge}</Typography>
            <Typography variant='body5' color='foundationColors.content.secondary'>
              {`(since ${launchDate})`}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing='4px' direction='column' flexBasis='50%'>
          <Typography
            align='right'
            allCaps
            variant='body9'
            color='foundationColors.content.secondary'
            dataAid="lockInKey"
          >
            Lock-in
          </Typography>
          <Stack direction='column' data-aid="tv_lockInValue">
            {isEmpty(lokinPeriodData) ? (
              <Typography align='right' variant='heading4'>
                NA
              </Typography>
            ) : (
              <>
                <Typography align='right' variant='heading4'>
                  {lokinPeriodData?.lockingPeriod}
                </Typography>
                {lokinPeriodData?.lockingAge && (
                  <Typography
                    align='right'
                    variant='body5'
                    color='foundationColors.content.secondary'
                  >
                    {`(${lokinPeriodData?.lockingAge})`}
                  </Typography>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack direction='row' justifyContent='space-between'>
        <Stack spacing='4px' direction='column'>
          <Stack direction='row' spacing='4px' alignItems='center'>
            <Typography allCaps variant='body9' color='foundationColors.content.secondary' dataAid="expenseratioKey" >
              Expense ratio
            </Typography>
            <Box sx={{ height: '16px', width: '16px' }}>
              <Tooltip
                dataAid="expenseRatio"
                title='This is the annual maintenance fee charged by the Asset Management Companies. This includes opearting costs, management fees, etc.'
              >
                <div>
                  <Icon
                    src={require('assets/info_icon_ds.svg')}
                    size='16px'
                    className='ec_info_icon'
                    alt='info_icon'
                    dataAid='infoExpenseRatio'
                  />
                </div>
              </Tooltip>
            </Box>
          </Stack>
          <Typography variant='heading4' dataAid="expenseRatioValue">
            {isValidValue(
              fundData?.portfolio?.expense_ratio,
              `${fundData?.portfolio?.expense_ratio}%`
            )}
          </Typography>
        </Stack>
        <Stack spacing='4px' direction='column'>
          <Typography
            allCaps
            variant='body9'
            align='right'
            color='foundationColors.content.secondary'
            dataAid="totalAumKey"
          >
            Total Aum
          </Typography>
          <Typography variant='heading4' align='right' data-aid="tv_totalAumValue">
            {isValidValue(fundData?.performance?.aum, `₹ ${fundData?.performance?.aum}`)}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction='column' spacing='4px'>
        <Stack direction='row' spacing='4px' alignItems='center'>
          <Typography dataAid="exitLoadKey" variant='body9' allCaps color='foundationColors.content.secondary'>
            Exit load
          </Typography>
          <Box sx={{ height: '16px', width: '16px' }}>
            <Tooltip
              dataAid="exitLoad"
              title='This refers to the fee charged by the Asset Management Companies at the time of exiting or redeeming fund units'
            >
              <div>
                <Icon
                  src={require('assets/info_icon_ds.svg')}
                  size='16px'
                  className='ec_info_icon'
                  alt='info_icon'
                  dataAid='infoExitLoad'
                />
              </div>
            </Tooltip>
          </Box>
        </Stack>
        {isEmpty(fundData?.additional_info?.exit_load) && (
          <Typography variant='heading4' dataAid="exitLoadNA" >NA</Typography>
        )}
        {fundData?.additional_info?.exit_load?.map((exitLoadData, idx) => {
          return (
            <div key={idx} data-aid={`tv_exitLoadValue${idx}`} >
              <Typography variant='heading4' allCaps>
                {`${nonRoundingToFixed(exitLoadData?.value, 2)}${exitLoadData?.unit}`}
              </Typography>
              <Typography
                component='span'
                variant='body5'
                color='foundationColors.content.secondary'
                sx={{ marginLeft: '5px' }}
              >
                ({exitLoadData?.period})
              </Typography>
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default FundStats;
