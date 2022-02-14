import { Box, ClickAwayListener, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { getInvestedValue, getPotentialValue } from '../../dashboard/Invest/common/commonFunctions';
import { Pill, Pills } from '../../designSystem/atoms/Pills/Pills';
import Separator from '../../designSystem/atoms/Separator';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import Typography from '../../designSystem/atoms/Typography';
import CollapsibleSection from '../../designSystem/molecules/CollapsibleSection';
import InputField from '../../designSystem/molecules/InputField';
import { formatAmountInr } from '../../utils/validators';
import Tooltip from '../../designSystem/atoms/Tooltip';
import Icon from '../../designSystem/atoms/Icon';
import { getProjectedValue } from '../../reports/common/functions';

const ReturnCalculator = ({ fundData }) => {
  const [pillValue, setPillValue] = useState('sip');
  const [amountToBeInvested, setAmountToBeInvested] = useState({ sip: 1000, lumpsum: 10000 });
  const [investmentYear, setInvestmentYear] = useState(5);
  const [isReturnCalcOpen, setIsReturnCalcOpen] = useState(false);
  const [investedAmount, setInvestedAmount] = useState('');
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [expectedAmount, setExpectedAmount] = useState('');
  const isRecurring = useMemo(() => pillValue === 'sip', [pillValue]);

  useEffect(() => {
    const investedValue = getInvestedValue(
      investmentYear,
      amountToBeInvested[pillValue],
      isRecurring
    );
    const expectedValue = getProjectedValue(
      amountToBeInvested[pillValue],
      investmentYear,
      pillValue
    );
    console.log('expected val', expectedValue);
    setExpectedAmount(expectedValue);
    setInvestedAmount(investedValue);
  }, [amountToBeInvested,pillValue, investmentYear, isRecurring]);

  const handleReturnCalcSection = () => {
    setIsReturnCalcOpen(!isReturnCalcOpen);
  };
  const onPillChange = (e, value) => {
    setPillValue(value);
  };
  const handleInvestmentYear = (e, value) => {
    setInvestmentYear(value);
  };

  const handleAmountChange = (e) => {
    if(isNaN(e.target.value)) return;
    const amountValue = Number(e.target.value);
    setAmountToBeInvested({ ...amountToBeInvested, [pillValue]: amountValue });
  };

  const handleTooltip = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };
  return (
    <div>
      <CollapsibleSection
        isOpen={isReturnCalcOpen}
        onClick={handleReturnCalcSection}
        label='Return calculator'
      >
        <Stack direction='column' spacing={3} sx={{ pb: 3 }}>
          <Box sx={{ maxWidth: 'fit-content' }}>
            <Pills value={pillValue} onChange={onPillChange}>
              <Pill label='SIP' value='sip' />
              <Pill label='Lumpsum' value='lumpsum' />
            </Pills>
          </Box>

          <InputField
            label='Amount'
            prefix='₹'
            value={amountToBeInvested[pillValue]}
            onChange={handleAmountChange}
          />
          <Stack direction='column' spacing={2}>
            <Typography variant='heading4' color='foundationColorContentSecondary'>
              Investment period
            </Typography>
            <Box sx={{ mt: 4, maxWidth: 'fit-content' }}>
              <Timelines value={investmentYear} onChange={handleInvestmentYear}>
                <TimeLine label='1Y' value={1} />
                <TimeLine label='3Y' value={3} />
                <TimeLine label='5Y' value={5} />
                <TimeLine label='10Y' value={10} />
                <TimeLine label='15Y' value={15} />
                <TimeLine label='20Y' value={20} />
              </Timelines>
            </Box>
          </Stack>
          <Separator />

          <Stack direction='row' justifyContent='space-between'>
            <Stack direction='column'>
              <Typography variant='heading2'>{formatAmountInr(investedAmount)}</Typography>
              <Typography variant='body1' color='foundationColors.content.secondary'>
                You invested
              </Typography>
            </Stack>
            <Stack direction='column'>
              <Stack direction='row' spacing='4px' alignItems='flex-end' justifyContent='flex-end'>
                <Typography variant='heading2' color='primary' align='right'>
                  {formatAmountInr(expectedAmount)}
                </Typography>
                  <div>
                    <Tooltip
                      open={isTooltipOpen}
                      title={`Estimated based on the fund's last ${
                        investmentYear <= 5 ? investmentYear : 5
                      } years returns`}
                    >
                      <div>
                        <Icon
                          src={require('assets/info_icon_ds.svg')}
                          size='16px'
                          className='ec_info_icon'
                          alt='info_icon'
                          dataAid='right'
                          onClick={handleTooltip}
                        />
                      </div>
                    </Tooltip>
                  </div>
              </Stack>
              <Typography variant='body1' color='foundationColors.content.secondary' align='right'>
                Estimated return (+16.7%)
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CollapsibleSection>
    </div>
  );
};

export default ReturnCalculator;
