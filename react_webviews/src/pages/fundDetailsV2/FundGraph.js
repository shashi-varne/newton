import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetch_fund_graph } from '../../fund_details/common/ApiCalls';
import { TimeLine, Timelines } from '../../designSystem/atoms/TimelineList';
import moment from 'moment';
import './FundGraph.scss';
import { useDispatch, useSelector } from 'react-redux';
// import { setFundTimePeriod } from 'businesslogic/dataStore/reducers/fundDetailsReducer';
import isEmpty from 'lodash/isEmpty';
import { Box, Stack } from '@mui/material';
import WrapperBox from '../../designSystem/atoms/WrapperBox';
import Typography from '../../designSystem/atoms/Typography';

const getTimeInMs = (time) => time * 60 * 60 * 24 * 1000;
const FundGraph = () => {
  const [graphData, setGraphData] = useState([]);
  // const fundTimePeriod = useSelector(state => {console.log("state is",state)});
  const [fundTimePeriod, setFundTimePeriod] = useState('5Y');
  const [periodWiseData, setPeriodWiseData] = useState({});
  const dispatch = useDispatch();
  const getGraphData = async () => {
    const graph_data = await fetch_fund_graph('INF109K01480');
    const amfi_data = graph_data.graph_report[0].graph_data_for_amfi;
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
    getGraphData();
  }, []);

  const handleTimePeriodChange = (e, value) => {
    setFundTimePeriod(value);
    setGraphData(periodWiseData[value]);
  };
  const options = {
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
        console.log('this is', this);
        return renderToStaticMarkup(
          <WrapperBox elevation={1}>
            <Stack sx={{ p: '16px 8px' }} direction='column'>
              <Typography variant='body5' color='foundationColors.content.secondary'>
                {moment(this.key).format('DD MMM YYYY').toUpperCase()}
              </Typography>
              <Typography variant='body5'>NAV: ₹{this.y.toFixed(2)}</Typography>
            </Stack>
          </WrapperBox>
          // '<div class="tooltip-container"><p class="date"><b>' +
          // moment(this.key).format("DD MMM YYYY").toUpperCase() +
          // '</b></p><div class="next-line-container"><div><p class="dot"></p></div><p class="content">NAV: ₹</p><p class="content">' +
          // this.y.toFixed(2) +
          // "</p></div></div>"
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
        lineColor: '#7ED321',
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
        zIndex: 3,
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
            return '<p class="xaxis-label">' + moment(this.pos).format('DD MMM YYYY') + '</p>';
          if (this.isLast) return '<p class="xaxis-label">TODAY</p>';
          if (fundTimePeriod === '3Y' || fundTimePeriod === '5Y')
            return '<p class="xaxis-label">' + moment(this.pos).format('YYYY') + '</p>';
          if (fundTimePeriod === '3M' || fundTimePeriod === '6M' || fundTimePeriod === '1M')
            return '<p class="xaxis-label">' + moment(this.pos).format('DD MMM') + '</p>';
        },
      },
      tickColor: '',
      tickLength: 0,
      tickWidth: 0,
    },
    rangeSelector: {
      verticalAlign: 'bottom',
      x: 0,
      y: 0,
      enabled: false,
      selected: 0,
      inputEnabled: false,
      buttonPosition: {
        align: 'center',
        x: -50,
        y: 10,
      },
      buttonTheme: {
        fill: '#F0F7FF',
        stroke: 'none',
        r: 4,
        width: 35,
        style: {
          color: '#767E86',
        },
        states: {
          hover: {},
          select: {
            fill: '#3792FC',
            style: {
              color: 'white',
            },
          },
        },
      },
    },
    series: [
      {
        data: graphData,
      },
    ],
  };
  if (isEmpty(graphData)) return null;
  return (
    <div className='fund-graph-wrapper'>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <Timelines onChange={handleTimePeriodChange} value={fundTimePeriod}>
        <TimeLine label='1M' value='1M' />
        <TimeLine label='3M' value='3M' />
        <TimeLine label='6M' value='6M' />
        <TimeLine label='1Y' value='1Y' />
        <TimeLine label='3Y' value='3Y' />
        <TimeLine label='5Y' value='5Y' />
      </Timelines>
    </div>
  );
};

export default FundGraph;
