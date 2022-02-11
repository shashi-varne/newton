import { Box, ClickAwayListener, Stack } from '@mui/material';
import React, { useState } from 'react';
import Typography from '../../designSystem/atoms/Typography';
import intervalToDuration from 'date-fns/intervalToDuration';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { nonRoundingToFixed } from '../../utils/validators';
import Tooltip from '../../designSystem/atoms/Tooltip';
import Icon from '../../designSystem/atoms/Icon';

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
  const [isTooltipOpen, setIsTooltipOpen] = useState({
    er: false,
    el: false,
  });
  const fullAgeData = calculateFullAge(fundData?.additional_info?.launch_date);
  const fundAge = calculateFundAge(fullAgeData);
  const launchDate = format(
    parse(fundData?.additional_info?.launch_date, 'dd/MM/yyyy', new Date()),
    'MMM d, yyyy'
  );

  const handleTooltipClosure = (anchor) => () => {
    setIsTooltipOpen({ ...isTooltipOpen, [anchor]: false });
  };

  const handleTooltip = (anchor) => () => {
    setIsTooltipOpen({ ...isTooltipOpen, [anchor]: true });
  };
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
          <Stack direction='row' spacing='4px' alignItems='center'>
            <Typography allCaps variant='body9' color='foundationColors.content.secondary'>
              Expense ratio
            </Typography>
            <ClickAwayListener onClickAway={handleTooltipClosure('er')}>
              <Box sx={{ height: '16px', width: '16px' }}>
                <Tooltip
                  open={isTooltipOpen['er']}
                  title='This is the annual maintenance fee charged by the Asset Management Companies. This includes opearting costs, management fees, etc.'
                >
                  <div>
                    <Icon
                      src={require('assets/info_icon_ds.svg')}
                      size='16px'
                      className='ec_info_icon'
                      alt='info_icon'
                      dataAid='right'
                      onClick={handleTooltip('er')}
                    />
                  </div>
                </Tooltip>
              </Box>
            </ClickAwayListener>
          </Stack>
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
        <Stack direction='row' spacing='4px' alignItems='center'>
          <Typography variant='body9' allCaps color='foundationColors.content.secondary'>
            Exit load
          </Typography>
          <ClickAwayListener onClickAway={handleTooltipClosure('el')}>
            <Box sx={{ height: '16px', width: '16px' }}>
              <Tooltip
                open={isTooltipOpen['el']}
                title='This refers to the fee charged by the Asset Management Companies at the time of exiting or redeeming fund units'
              >
                <div>
                  <Icon
                    src={require('assets/info_icon_ds.svg')}
                    size='16px'
                    className='ec_info_icon'
                    alt='info_icon'
                    dataAid='right'
                    onClick={handleTooltip('el')}
                  />
                </div>
              </Tooltip>
            </Box>
          </ClickAwayListener>
        </Stack>
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
