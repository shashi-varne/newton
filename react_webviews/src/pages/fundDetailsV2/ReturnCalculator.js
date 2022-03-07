import { Box, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { getInvestedValue } from '../../dashboard/Invest/common/commonFunctions';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import Separator from '../../designSystem/atoms/Separator';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import InputField from '../../designSystem/molecules/InputField';
import { formatAmountInr } from '../../utils/validators';
import Tooltip from '../../designSystem/atoms/Tooltip';
import Icon from '../../designSystem/atoms/Icon';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFundData,
  resetReturnCalculatorData,
  setAmount,
  setExpectedAmount,
  setExpectedReturnPerc,
  setInvestedAmount,
  setInvestmentPeriod,
  setInvestmentType,
} from 'businesslogic/dataStore/reducers/fundDetails';
import { getExpectedReturn, isValidValue } from './helperFunctions';
import isEmpty from 'lodash/isEmpty';

const getEstimatedReturnTooltip = (investmentPeriod, expectedAmount) => {
  if (!expectedAmount) {
    return `Estimated return for ${investmentPeriod} year is not available`;
  } else {
    return `Estimated based on the fund's last ${
      investmentPeriod <= 5 ? investmentPeriod : 5
    } years returns`;
  }
};

const ReturnCalculator = () => {
  const [isReturnCalcOpen, setIsReturnCalcOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const dispatch = useDispatch();
  const fundData = useSelector(getFundData);
  const investmentType = useSelector((state) => state?.fundDetails?.investmentType);
  const investmentPeriod = useSelector((state) => state?.fundDetails?.investmentPeriod);
  const isRecurring = useMemo(() => investmentType === 'sip', [investmentType]);
  const amountToBeInvested = useSelector((state) => state?.fundDetails[investmentType]);
  const investedAmount = useSelector((state) => state?.fundDetails?.investedAmount);
  const expectedAmount = useSelector((state) => state?.fundDetails?.expectedAmount);
  const expectedReturnPerc = useSelector((state) => state?.fundDetails?.expectedReturnPerc);
  const fundReturns = fundData?.performance?.returns || [];
  const isReturnAvailable = isEmpty(fundReturns);
  const estimatedReturnTooltip = useMemo(
    () => getEstimatedReturnTooltip(investmentPeriod, expectedAmount),
    [expectedAmount, investmentPeriod]
  );
  const isOneYearReturnAvailable = fundReturns?.find(el => el?.name.match(/1 year/));
  const disableChild = isEmpty(isOneYearReturnAvailable);
  const returns = useMemo(() => {
    const yearReturns = {};
    // eslint-disable-next-line no-unused-expressions
    fundReturns?.forEach((el) => {
      if (el.name.match(/year/)) {
        const year = el.name.match(/\d+/g).join('');
        yearReturns[year] = el.value;
      }
    });
    return yearReturns;
  }, [fundData]);

  useEffect(() => {
    dispatch(setExpectedReturnPerc(returns[investmentPeriod]));

    return () => {
      dispatch(resetReturnCalculatorData());
    };
  }, [fundData]);

  useEffect(() => {
    const investedValue = getInvestedValue(investmentPeriod, amountToBeInvested, isRecurring);
    const expectedValue = getExpectedReturn(
      amountToBeInvested,
      investmentPeriod,
      investmentType,
      expectedReturnPerc
    );
    dispatch(setExpectedAmount(expectedValue));
    dispatch(setInvestedAmount(investedValue));
  }, [amountToBeInvested, investmentType, investmentPeriod, isRecurring, expectedReturnPerc]);

  const handleReturnCalcSection = () => {
    setIsReturnCalcOpen(!isReturnCalcOpen);
  };
  const onPillChange = (e, value) => {
    dispatch(setInvestmentType(value));
  };
  const handleInvestmentYear = (e, val) => {
    dispatch(setInvestmentPeriod(val));
    val = val < 5 ? val : 5;
    dispatch(setExpectedReturnPerc(returns[val]));
  };

  const handleAmountChange = (e) => {
    if (isNaN(e.target.value)) return;
    const amountValue = Number(e.target.value);
    dispatch(setAmount(amountValue));
  };

  const handleTooltip = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };
  return (
    <Box sx={{ mt: 4 }}>
      <CollapsibleSection
        isOpen={isReturnCalcOpen}
        onClick={handleReturnCalcSection}
        label={`Return calculator ${isReturnAvailable ? '(N/A)' : ''}`}
        disabled={isReturnAvailable}
      >
        <Stack direction='column' spacing={3} sx={{ pb: 3 }}>
          <Box sx={{ maxWidth: 'fit-content' }}>
            <Pills value={investmentType} onChange={onPillChange}>
              <Pill label='SIP' value='sip' dataAid="sip" />
              <Pill label='Lumpsum' value='lumpsum' dataAid="lumpsum" />
            </Pills>
          </Box>

          <InputField
            label='Amount'
            prefix='₹'
            value={amountToBeInvested}
            onChange={handleAmountChange}
            disabled={disableChild}
            inputProps={{
              inputMode: 'numeric'
            }}
            dataAid="1"
          />
          <Stack direction='column' spacing={2}>
            <Typography dataAid="investmentPeriod" variant='heading4' color='foundationColorContentSecondary'>
              Investment period
            </Typography>
            <Box sx={{ mt: 4, maxWidth: 'fit-content' }}>
              <Timelines value={investmentPeriod} onChange={handleInvestmentYear}>
                {timeLines?.map((el, id) => {
                  const isDisabled = useMemo(
                    () =>
                      disableReturnCalculatorTimePeriod(fundData?.performance.returns, el.value),
                    []
                  );
                  return (
                    <TimeLine dataAid={id} disabled={isDisabled} key={id} label={el.label} value={el.value} />
                  );
                })}
              </Timelines>
            </Box>
          </Stack>
          <Separator dataAid="1" />

          <Stack direction='row' justifyContent='space-between'>
            <Stack direction='column'>
              <Typography dataAid="investedValue" variant='heading2'>{formatAmountInr(investedAmount)}</Typography>
              <Typography dataAid="investedKey" variant='body1' color='foundationColors.content.secondary'>
                You invested
              </Typography>
            </Stack>
            <Stack direction='column'>
              <Stack direction='row' spacing='4px' alignItems='flex-end' justifyContent='flex-end'>
                <Typography dataAid="estimatedReturnValue" variant='heading2' color='primary' align='right'>
                  {isValidValue(expectedAmount, formatAmountInr(expectedAmount))}
                </Typography>
                <div>
                  <Tooltip dataAid="returns" open={isTooltipOpen} title={estimatedReturnTooltip}>
                    <div>
                      <Icon
                        src={require('assets/info_icon_ds.svg')}
                        size='16px'
                        className='ec_info_icon'
                        alt='info_icon'
                        dataAid='infoReturnValue'
                        onClick={handleTooltip}
                      />
                    </div>
                  </Tooltip>
                </div>
              </Stack>
              <Typography dataAid="estimatedReturnKey" variant='body1' color='foundationColors.content.secondary' align='right'>
                Estimated return{' '}
                <Typography component='span' variant='inherit' color='primary'>
                  ({isValidValue(expectedReturnPerc, `${expectedReturnPerc}%`)})
                </Typography>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CollapsibleSection>
    </Box>
  );
};

export default ReturnCalculator;

const timeLines = [
  {
    label: '1Y',
    value: 1,
  },
  {
    label: '3Y',
    value: 3,
  },
  {
    label: '5Y',
    value: 5,
  },
  {
    label: '10Y',
    value: 10,
  },
  {
    label: '15Y',
    value: 15,
  },
  {
    label: '20Y',
    value: 20,
  },
];

const disableReturnCalculatorTimePeriod = (returns = [], timePeriod) => {
  let isDisable = true;
  if (isEmpty(returns)) return true;
  if (timePeriod > 5) {
    timePeriod = 5;
  }
  // eslint-disable-next-line no-unused-expressions
  returns?.some((el) => {
    if (!el.name.match(/month/) && el.name.match(`${timePeriod} year`)) {
      isDisable = false;
    }
  });
  return isDisable;
};
