import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { getRollingReturnData } from 'businesslogic/dataStore/reducers/fundDetails';
import { Box, Stack } from '@mui/material';
import Typography from '../../designSystem/atoms/Typography';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import Separator from '../../designSystem/atoms/Separator';
import FundCommonGraph from './FundCommonGraph';
import isEmpty from 'lodash/isEmpty';
import { isValidValue } from './helperFunctions';
import useLoadingState from '../../common/customHooks/useLoadingState';
import Tooltip from '../../designSystem/atoms/Tooltip';
import Icon from '../../designSystem/atoms/Icon';

const screen = 'fundDetailsV2';
const secondaryColor = 'foundationColors.content.secondary';
const rollingRetunInfo =
  "This indicates how the fund's returns have stacked up for a particular investment period. E.g. A 3-year  rolling return would show the average annual return for every 3 years since the start of the fund till today";
const RollingReturn = ({fundDetailsRef, sendEvents}) => {
  const [investmentYear, setInvestmentYear] = useState(36);
  const { loadingData } = useLoadingState(screen);
  const rollingReturnData = useSelector(getRollingReturnData);
  const rollingData = rollingReturnData[investmentYear];
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const rollingGraphData = !isEmpty(rollingData?.data) ? rollingData?.data : [];
  const returnGraphData = [...rollingGraphData];
  const avoidFirstRender = useRef(null);
  const NET_ASSET_VALUE = useMemo(() => {
    return [
      {
        name: 'Minimum',
        value: rollingData?.min,
      },
      {
        name: 'Maximum',
        value: rollingData?.max,
      },
      {
        name: 'Average',
        value: rollingData?.avg,
      },
    ];
  }, [rollingReturnData, investmentYear]);

  useEffect(() => {
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      rolling_return: 'investment period',
      rolling_return_investment_period: investmentYear,
    }
    if(avoidFirstRender.current){
      sendEvents('back');
    }
    avoidFirstRender.current = true;
  },[investmentYear])
  const handleInvestmentYear = (e, value) => {
    setInvestmentYear(value);
  };

  const handleTooltip = () => {
    fundDetailsRef.current = {
      ...fundDetailsRef.current,
      rolling_return: 'what is rolling return?',
    }
    if(!isTooltipOpen) {
      sendEvents('back');
    }
    setIsTooltipOpen(!isTooltipOpen);
  };

  function labelFormatter() {
    if (this.isFirst) return '<p class="xaxis-label">' + format(this.pos, 'd MMM yyyy') + '</p>';
    if (this.isLast) return '<p class="xaxis-label">TODAY</p>';
    if (investmentYear === 36 || investmentYear === 12 || investmentYear === 60)
      return '<p class="xaxis-label">' + format(this.pos, 'yyyy') + '</p>';
    if (investmentYear === 3 || investmentYear === 6 || investmentYear === 1)
      return '<p class="xaxis-label">' + format(this.pos, 'd MMM') + '</p>';
  }
  function tooltipFormatter() {
    console.log("this",this);
    return (
      '<div class="tooltip-container"><div class="tooltip-date">' +
      format(this.key, 'MMM d yyyy') +
      '</div><div class="tooltip-nav-amount">' +
      this.y.toFixed(2) +
      '%</div></div>'
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }} data-aid="grp_rollingReturns" >
      <Stack>
        <Typography dataAid="title" variant='heading4' color={secondaryColor}>
          Investment period
        </Typography>
        <Box sx={{ mt: 4, maxWidth: 'fit-content' }}>
          <Timelines value={investmentYear} onChange={handleInvestmentYear}>
            {ROLLING_RETURN_TIMELINES?.map((timeline, idx) => {
              const isDisable = !rollingReturnData[timeline?.value];
              return (
                <TimeLine
                  key={idx}
                  label={timeline.label}
                  value={timeline.value}
                  disabled={isDisable}
                  dataAid={idx}
                />
              );
            })}
          </Timelines>
        </Box>
        <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
          <Typography dataAid="netAssetValue" variant='heading4' color={secondaryColor}>
            Net asset value
          </Typography>
          {NET_ASSET_VALUE?.map((net_asset, idx) => {
            const value = net_asset?.value > 0 ? `+ ${net_asset?.value}` : `${net_asset?.value}`;
            return (
              <Stack key={idx} direction='column' spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography dataAid={`${net_asset?.name?.toLowerCase()}Key`} variant='body8' color={secondaryColor}>
                    {net_asset?.name}
                  </Typography>
                  <Typography dataAid={`${net_asset?.name?.toLowerCase()}Value`} variant='heading4' color={secondaryColor}>
                    {isValidValue(net_asset?.value, `${value}%`)}
                  </Typography>
                </Stack>
                {NET_ASSET_VALUE?.length !== idx + 1 && <Separator dataAid={4+idx} />}
              </Stack>
            );
          })}
        </Stack>
        <div className='fund-graph-wrapper'>
          <FundCommonGraph
            isGraphLoading={loadingData.isGraphLoading}
            graphData={returnGraphData}
            labelFormatter={labelFormatter}
            tooltipFormatter={tooltipFormatter}
            isRollingReturn
          />
        </div>
        <Stack sx={{mt: 1}} direction='row' spacing={1} alignItems='center' justifyContent='flex-start'>
          <Typography dataAid="note" variant='body5' color='foundationColors.content.tertiary'>What is rolling return?</Typography>
          <div>
            <Tooltip dataAid="rollingReturn" open={isTooltipOpen} title={rollingRetunInfo}>
              <Stack width='16px' height='16px'>
                <Icon
                  src={require('assets/info_icon_ds.svg')}
                  size='16px'
                  className='ec_info_icon'
                  alt='info_icon'
                  dataAid='infoRollingReturn'
                  onClick={handleTooltip}
                />
              </Stack>
            </Tooltip>
          </div>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RollingReturn;

const ROLLING_RETURN_TIMELINES = [
  {
    label: '3M',
    value: 3,
  },
  {
    label: '6M',
    value: 6,
  },
  {
    label: '1Y',
    value: 12,
  },
  {
    label: '3Y',
    value: 12 * 3,
  },
  {
    label: '5Y',
    value: 12 * 5,
  },
];
