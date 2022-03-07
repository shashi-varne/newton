import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getExpectedReturn } from './helperFunctions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import getTheme from '../../theme';
import { formatAmountInr } from '../../utils/validators';

import './ComparisonChart.scss';
import { Box, Stack } from '@mui/material';
import Typography from '../../designSystem/atoms/Typography';

const ComparisonChart = () => {
  const investmentType = useSelector((state) => state?.fundDetails?.investmentType);
  const investmentPeriod = useSelector((state) => state?.fundDetails?.investmentPeriod);
  const amountToBeInvested = useSelector((state) => state?.fundDetails[investmentType]);

  const investedAmount = useSelector((state) => state?.fundDetails?.investedAmount);
  const expectedAmount = useSelector((state) => state?.fundDetails?.expectedAmount) || 0;
  const savingsExpectedAmount = getExpectedReturn(
    amountToBeInvested,
    investmentPeriod,
    investmentType,
    3.5
  );
  const fdExpectedAmount = getExpectedReturn(
    amountToBeInvested,
    investmentPeriod,
    investmentType,
    7
  );
  const theme = useMemo(getTheme, []);
  const chartConfig = {
    chart: {
      type: 'column',
      height: '230px',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: ['Savings account', 'Fixed deposit', 'This fund'],
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: undefined,
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          const investedAmountGraphData = Number(this?.points[0][0]);
          const cumulativeAmountGraphData = Number(this?.points[0][1]);
          let expectedReturnAmount = cumulativeAmountGraphData - investedAmountGraphData;
          expectedReturnAmount = formatAmountInr(expectedReturnAmount) || 'NA';
          return '<div class="comparison-chart-values">' + expectedReturnAmount + '</div>';
        },
      },
      labels: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
        },
      },
      series: {
        states: {
          inactive: {
            opacity: 1,
          },
          hover: {
            enabled: false,
          },
        },
      },
    },
    series: [
      {
        name: 'Returns gained',
        data: [savingsExpectedAmount, fdExpectedAmount, expectedAmount],
        color: theme?.palette?.foundationColors?.primary['400'],
      },
      {
        name: 'Principal invested',
        data: [investedAmount, investedAmount, investedAmount],
        color: theme?.palette?.foundationColors?.primary['200'],
      },
    ],
  };
  return (
    <div className='comparison-chart-wrapper'>
      <HighchartsReact highcharts={Highcharts} options={chartConfig} />
      <Stack direction='row' spacing={2} alignItems='center'>
        {CHART_LEGEND_DATA?.map((el, idx) => {
          return (
            <Stack key={idx} spacing={1} direction='row' alignItems='center'>
              <Box
                sx={{
                  borderRadius: '100%',
                  height: '6px',
                  width: '6px',
                  backgroundColor: el.backgroundColor,
                }}
                data-aid={`iv_${el.id}`}
              />
              <Typography dataAid={el.id} variant='body5' color='foundationColors.content.secondary'>
                {el.name}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
};

export default ComparisonChart;

const CHART_LEGEND_DATA = [
  {
    name: 'Principal invested',
    backgroundColor: 'foundationColors.primary.200',
    id: "pricipalInvested"
  },
  {
    name: 'Returns gained',
    backgroundColor: 'foundationColors.primary.400',
    id: "returnsGained"
  },
];
