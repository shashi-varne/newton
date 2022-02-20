import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getExpectedReturn } from './helperFunctions';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import getTheme from '../../theme';

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
      panning: false,
      pinchType: false,
      zoomType: '',
      zoomKey: '',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: ['Savings account', 'Fixed deposit', 'This fund'],
    },
    yAxis: {
      min: 0,
      title: {
        text: undefined,
      },
      stackLabels: {
        enabled: false,
      },
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: 'Returns gained',
        data: [savingsExpectedAmount, fdExpectedAmount, expectedAmount],
      },
      {
        name: 'Principal invested',
        data: [investedAmount, investedAmount, investedAmount],
      },
    ],
  };

  const getChartData = useCallback(
    (exAmount, savAmount, fdAmount) => {
      console.log('expectedAmount', exAmount);
      console.log('savingsExpectedAmount', savAmount);
      console.log('fdExpectedAmount', fdAmount);
      return;
    },
    [expectedAmount, savingsExpectedAmount, fdExpectedAmount]
  );
  const options = {
    chart: {
      type: 'column',
      height: 150,
    },
    legend: {
      margin: 5,
      itemDistance: 10,
      enabled: false,
    },
    xAxis: {
      visible: true,
    },
    yAxis: {
      stackLabels: {
        enabled: false,
        align: 'center',
      },
      visible: false,
      title: { enabled: false, text: 'Count' },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          inside: false,
        },
      },
      series: {
        stacking: 'normal',
      },
    },
    series: [
      {
        data: [savingsExpectedAmount, fdExpectedAmount, expectedAmount],
        name: 'Returns gained',
        minPointLength: 5,
        color: theme?.palette?.foundationColors?.primary['400'],
      },
      {
        data: [investedAmount, investedAmount, investedAmount],
        name: 'Principal invested',
        minPointLength: 10,
        color: theme?.palette?.foundationColors?.primary['200'],
      },
    ],
  };
  const [chartData, setChartData] = useState(chartConfig);

  useEffect(() => {
    setChartData({ ...options });
  }, [expectedAmount, savingsExpectedAmount, fdExpectedAmount]);
  console.log('chart daya is', chartData);
  return (
    <div>
      <HighchartsReact
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[true, true, true]}
        highcharts={Highcharts}
        options={chartData}
      />
    </div>
  );
};

export default ComparisonChart;
