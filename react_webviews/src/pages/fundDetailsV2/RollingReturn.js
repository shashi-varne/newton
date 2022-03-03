import React, { useMemo, useState } from 'react';
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

const screen = 'fundDetailsV2';
const secondaryColor = 'foundationColors.content.secondary';
const RollingReturn = () => {
  const [investmentYear, setInvestmentYear] = useState(36);
  const { loadingData } = useLoadingState(screen);
  const rollingReturnData = useSelector(getRollingReturnData);
  const rollingData = rollingReturnData[investmentYear];
  const rollingGraphData = !isEmpty(rollingData?.data) ? rollingData?.data : [];
  const returnGraphData = [...rollingGraphData];
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
  const handleInvestmentYear = (e, value) => {
    setInvestmentYear(value);
  };

  function labelFormatter() {
    if (this.isFirst) return '<p class="xaxis-label">' + format(this.pos, 'd MMM yyyy') + '</p>';
    if (this.isLast) return '<p class="xaxis-label">TODAY</p>';
    if (investmentYear === 36 || investmentYear === 12 || investmentYear === 60)
      return '<p class="xaxis-label">' + format(this.pos, 'yyyy') + '</p>';
    if (investmentYear === 3 || investmentYear === 6 || investmentYear === 1)
      return '<p class="xaxis-label">' + format(this.pos, 'd MMM') + '</p>';
  }
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Stack>
        <Typography variant='heading4' color={secondaryColor}>
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
                />
              );
            })}
          </Timelines>
        </Box>
        <Stack sx={{ mt: 4, mb: 2 }} direction='column' spacing={3}>
          <Typography variant='heading4' color={secondaryColor}>
            Net asset value
          </Typography>
          {NET_ASSET_VALUE?.map((net_asset, idx) => {
            const value = net_asset?.value > 0 ? `+ ${net_asset?.value}` : `${net_asset?.value}`;
            return (
              <Stack key={idx} direction='column' spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body8' color={secondaryColor}>
                    {net_asset?.name}
                  </Typography>
                  <Typography variant='heading4' color={secondaryColor}>
                    {isValidValue(net_asset?.value, `${value}%`)}
                  </Typography>
                </Stack>
                {NET_ASSET_VALUE?.length !== idx + 1 && <Separator />}
              </Stack>
            );
          })}
        </Stack>
        <div className='fund-graph-wrapper'>
          <FundCommonGraph
            isGraphLoading={loadingData.isGraphLoading}
            graphData={returnGraphData}
            labelFormatter={labelFormatter}
          />
        </div>
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
