import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getExpectedReturn } from './helperFunctions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import getTheme from '../../theme';
import { formatAmountInr } from '../../utils/validators';

import './ComparisonChart.scss';

const ComparisonChart = () => {
  const investmentType = useSelector((state) => state?.fundDetails?.investmentType);
  const investmentPeriod = useSelector((state) => state?.fundDetails?.investmentPeriod);
  const amountToBeInvested = useSelector((state) => state?.fundDetails[investmentType]);
  const investedAmount = useSelector((state) => state?.fundDetails?.investedAmount);
  const expectedAmount = useSelector((state) => state?.fundDetails?.expectedAmount);
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
    yAxis: {
      title: {
        text: undefined,
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          const investedAmountGraphData = Number(this.points[0][0]);
          const cumulativeAmountGraphData = Number(this.points[0][1]);
          const expectedReturnAmount = cumulativeAmountGraphData - investedAmountGraphData;
          return (
            '<div class="comparison-chart-values">' +
            formatAmountInr(expectedReturnAmount) +
            '</div>'
          );
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      align: 'left',
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
        data: [savingsExpectedAmount, fdExpectedAmount, expectedAmount || 0],
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
      <HighchartsReact
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[true, true, true]}
        highcharts={Highcharts}
        options={chartConfig}
      />
    </div>
  );
};

export default ComparisonChart;
