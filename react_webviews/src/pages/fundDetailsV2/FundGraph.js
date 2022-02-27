import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import {
  fetchFundGraphData,
  getFundData,
  setFundTimePeriod,
} from 'businesslogic/dataStore/reducers/fundDetails';
import isEmpty from 'lodash/isEmpty';
import { Skeleton } from '@mui/material';
import format from 'date-fns/format';
import getTheme from '../../theme';
import Api from '../../utils/api';

import './FundGraph.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getUrlParams } from '../../utils/validators';
import useLoadingState from '../../common/customHooks/useLoadingState';

const screen = 'fundDetailsV2';

const getTimeInMs = (time) => time * 60 * 60 * 24 * 1000;
const FundGraph = () => {
  let { isins } = getUrlParams();
  const [graphData, setGraphData] = useState([]);
  const fundData = useSelector(getFundData);
  const fundTimePeriod = useSelector((state) => state?.fundDetails?.fundTimePeriod);
  const fundGraphData = useSelector((state) => state?.fundDetails?.fundGraphData);
  const { loadingData } = useLoadingState(screen);
  const disptach = useDispatch();
  const [periodWiseData, setPeriodWiseData] = useState({});
  const theme = getTheme();
  Highcharts.setOptions({
    lang: {
      rangeSelectorZoom: '',
    },
    colors: [theme?.palette?.foundationColors?.primary?.brand, '#ffffff'],
  });

  useEffect(() => {
    return () => {
      disptach(setFundTimePeriod('5Y'));
    };
  }, []);

  const getGraphData = async (dataGraph) => {
    if (isEmpty(dataGraph)) {
      dataGraph = {};
    }
    let graph_data = {};
    const payload = {
      isin: isins,
      Api,
      screen,
    };
    const fundGraphDataIsin = dataGraph?.graph_report?.[0]?.isin;
    if (isins !== fundData?.isin && fundGraphDataIsin !== isins) {
      disptach(fetchFundGraphData(payload));
    } else {
      if (isEmpty(dataGraph)) {
        disptach(fetchFundGraphData(payload));
      } else {
        graph_data = { ...dataGraph };
      }
    }
    if (isEmpty(dataGraph)) return null;

    const amfi_data = [...graph_data.graph_report?.[0].graph_data_for_amfi];
    const maxi = amfi_data[amfi_data.length - 1][0];
    const one_month_minimum = maxi - getTimeInMs(30);
    const three_month_minimum = maxi - getTimeInMs(90);
    const six_month_minimum = maxi - getTimeInMs(180);
    const one_year_minimum = maxi - getTimeInMs(365);
    const three_year_minimum = maxi - getTimeInMs(1095);
    const five_year_minimum = maxi - getTimeInMs(1825);
    let choppedData = {
      '1M': [],
      '3M': [],
      '6M': [],
      '1Y': [],
      '3Y': [],
      '5Y': [],
    };
    for (let i = 0; i < amfi_data.length; i++) {
      let presentValue = amfi_data[i][0];
      if (presentValue <= maxi) {
        if (presentValue >= one_month_minimum) {
          choppedData['1M'].push(amfi_data[i]);
        }
        if (presentValue >= three_month_minimum) {
          choppedData['3M'].push(amfi_data[i]);
        }
        if (presentValue >= six_month_minimum) {
          choppedData['6M'].push(amfi_data[i]);
        }
        if (presentValue >= one_year_minimum) {
          choppedData['1Y'].push(amfi_data[i]);
        }
        if (presentValue >= three_year_minimum) {
          choppedData['3Y'].push(amfi_data[i]);
        }
        if (presentValue >= five_year_minimum) {
          choppedData['5Y'].push(amfi_data[i]);
        }
      }
    }
    setPeriodWiseData(choppedData);
    setGraphData(amfi_data);
  };
  useEffect(() => {
    getGraphData(fundGraphData);
  }, [fundGraphData]);

  const handleTimePeriodChange = (e, value) => {
    disptach(setFundTimePeriod(value));
    const newData = [...periodWiseData[value]];
    setGraphData(newData);
  };
  const options = {
    title: {
      text: undefined,
    },
    yAxis: {
      opposite: false,
      crosshair: false,
      showLastLabel: true,
      labels: {
        formatter: function () {
          return '<p class="yaxis-label">' + (this.value > 0 ? '₹' : '') + this.value + '</p>';
        },
      },
      gridLineColor: '#F7F3FF',
      title: {
        text: undefined,
      },
    },

    tooltip: {
      backgroundColor: null,
      borderWidth: 0,
      shape: 'square',
      useHTML: true,
      formatter: function () {
        return (
          '<div class="tooltip-container"><div class="tooltip-date">' +
          format(this.key, 'MMM d yyyy') +
          '</div><div class="tooltip-nav-amount">₹' +
          this.y.toFixed(2) +
          ' NAV</div></div>'
        );
      },
    },
    plotOptions: {
      areaspline: {
        threshold: null,
        fillColor: {
          linearGradient: [0, 0, 0, 200],
          stops: [
            [0, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.6).get('rgba')],
            [1, Highcharts.color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')],
          ],
        },
        lineColor: theme?.foundationColors?.primary?.brand,
        lineWidth: 1.2,
        marker: {
          enabled: false,
          radius: 3,
          lineWidth: 0,
          zIndex: 100,
        },
        states: {
          hover: {
            halo: {
              size: 0,
            },
            lineWidthPlus: 0,
          },
        },
      },
    },
    chart: {
      type: 'areaspline',
      height: '250px',
      panning: false,
      zoomType: false,
      pinchType: false,
    },
    scrollbar: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    lang: {
      rangeSelectorZoom: '',
    },
    exporting: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      crosshair: {
        color: 'white',
        width: 2,
        zIndex: 1,
      },
      tickPositioner: function () {
        var positions = [];
        positions.push(this.min);
        var difference = this.max - this.min;
        positions.push(this.min + Math.round(difference / 3));
        positions.push(this.max - Math.round(difference / 3));
        positions.push(this.max);
        return positions;
      },
      labels: {
        formatter: function () {
          if (this.isFirst)
            return '<p class="xaxis-label">' + format(this.pos, 'd MMM yyyy') + '</p>';
          if (this.isLast) return '<p class="xaxis-label">TODAY</p>';
          if (fundTimePeriod === '3Y' || fundTimePeriod === '1Y' || fundTimePeriod === '5Y')
            return '<p class="xaxis-label">' + format(this.pos, 'yyyy') + '</p>';
          if (fundTimePeriod === '3M' || fundTimePeriod === '6M' || fundTimePeriod === '1M')
            return '<p class="xaxis-label">' + format(this.pos, 'd MMM') + '</p>';
        },
      },
      tickColor: '',
      tickLength: 0,
      tickWidth: 0,
    },
    series: [
      {
        data: graphData,
      },
    ],
  };
  if (loadingData.isGraphLoading || isEmpty(graphData))
    return (
      <Skeleton
        variant='rectangular'
        height='290px'
        width='100%'
        sx={{ mt: 3, borderRadius: 1, backgroundColor: 'foundationColors.primary.200' }}
      />
    );
  return (
    <div className='fund-graph-wrapper'>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <Timelines onChange={handleTimePeriodChange} value={fundTimePeriod}>
        {
          timeLines?.map((el, id) => {
            const isDisabled = id > fundData?.performance.returns.length - 1;
            return(
              <TimeLine disabled={isDisabled} key={id} label={el.label} value={el.value} />
            )
          })
        }
      </Timelines>
    </div>
  );
};

const timeLines = [
  {
    label: '1M',
    value: '1M',
  },
  {
    label: '3M',
    value: '3M',
  },
  {
    label: '6M',
    value: '6M',
  },
  {
    label: '1Y',
    value: '1Y',
  },
  {
    label: '3Y',
    value: '3Y',
  },
  {
    label: '5Y',
    value: '5Y',
  },
];

export default FundGraph;
