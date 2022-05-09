import { Box, Stack } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const ReturnCalculator = ({sendEvents, fundDetailsRef, isDataLoading}) => {
  const [isReturnCalcOpen, setIsReturnCalcOpen] = useState(false);
  const dispatch = useDispatch();
  const fundData = useSelector(getFundData);
  const investmentType = useSelector((state) => state?.fundDetails?.investmentType);
  const investmentPeriod = useSelector((state) => state?.fundDetails?.investmentPeriod);
  const isRecurring = useMemo(() => investmentType === 'sip', [investmentType, isDataLoading]);
  const amountToBeInvested = useSelector((state) => state?.fundDetails[investmentType]);
  const investedAmount = useSelector((state) => state?.fundDetails?.investedAmount);
  const expectedAmount = useSelector((state) => state?.fundDetails?.expectedAmount);
  const expectedReturnPerc = useSelector((state) => state?.fundDetails?.expectedReturnPerc);
  const fundReturns = fundData?.performance?.returns || [];
  const isReturnAvailable = isEmpty(fundReturns);
  const setAvailableReturnPeriod = useRef(false);
  const estimatedReturnTooltip = useMemo(
    () => getEstimatedReturnTooltip(investmentPeriod, expectedAmount),
    [expectedAmount, investmentPeriod, isDataLoading]
  );
  const isOneYearReturnAvailable = fundReturns?.find(el => el?.name.match(/1 year/));
  const disableChild = isEmpty(isOneYearReturnAvailable);
  const avoidFirstRef = useRef(null);
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
  }, [fundData, isDataLoading]);

  useEffect(() => {
    if(returns[investmentPeriod]) {
      dispatch(setExpectedReturnPerc(returns[investmentPeriod]));
    }

    return () => {
      dispatch(resetReturnCalculatorData());
    };
  }, [fundData]);

  useEffect(() => {
    if (avoidFirstRef.current) {
      sendEvents('back', investmentType, investmentPeriod);
    } else {
      fundDetailsRef.current = {
        ...fundDetailsRef.current,
        return_calculator_mode: investmentType,
        return_calculator_investment_period: investmentPeriod
      }
    }
    avoidFirstRef.current = true;
  }, [investmentType, investmentPeriod]);

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
    if(investmentType === 'sip' && amountValue > 50000) return;
    if(investmentType === 'lumpsum' && amountValue > 100000) return;
    dispatch(setAmount(amountValue));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <CollapsibleSection
        isOpen={isReturnCalcOpen}
        onClick={handleReturnCalcSection}
        label={`Return calculator ${isReturnAvailable ? '(NA)' : ''}`}
        disabled={isReturnAvailable || isDataLoading}
        dataAid="returnCalculator"
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
            inputMode='numeric'
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
                      disableReturnCalculatorTimePeriod(fundData?.performance?.returns, el.value),
                    [isDataLoading]
                  );
                  if(isDisabled && !setAvailableReturnPeriod.current) {
                    const availablePeriod = timeLines[id - 1] || timeLines[0];
                    dispatch(setInvestmentPeriod(availablePeriod?.value));
                    const availableExpectedReturn = returns[availablePeriod?.value];
                    dispatch(setExpectedReturnPerc(availableExpectedReturn));
                    setAvailableReturnPeriod.current = true;
                  }
                  return (
                    <TimeLine dataAid={id} disabled={isDisabled} key={id} label={el.label} value={el.value} />
                  );
                })}
              </Timelines>
            </Box>
          </Stack>
          <Separator dataAid="1" />

          <Stack direction='row' justifyContent='space-between' spacing={1}>
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
                  <Tooltip dataAid="returns" title={estimatedReturnTooltip}>
                    <div>
                      <Icon
                        src={require('assets/info_icon_ds.svg')}
                        size='16px'
                        className='ec_info_icon'
                        alt='info_icon'
                        dataAid='infoReturnValue'
                      />
                    </div>
                  </Tooltip>
                </div>
              </Stack>
              <Typography dataAid="estimatedReturnKey" variant='body1' color='foundationColors.content.secondary' align='right'>
                Estimated return{' '}
                <Typography component='span' variant='inherit' color='primary'>
                  ({isValidValue(expectedReturnPerc, `${expectedReturnPerc > 0 ? '+':'-'}${expectedReturnPerc}%`)})
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
