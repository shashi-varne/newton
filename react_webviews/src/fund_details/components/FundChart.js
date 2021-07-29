import React, { useState, useEffect, memo, useRef } from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';
import moment from 'moment';
import Report from '../common/Report';
import { formatAmountInr } from 'utils/validators';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

const config = getConfig();
const FundChart = (props) => {
  const graphDataForBenchMark = props?.graphData.graph_report[0].graph_data_for_benchmark;
  const fundGraph = props?.graphData.graph_report[0].graph_data_for_amfi;
  const [buttonColor, setButtonColor] = useState('');
  const [buttonBgColor, setButtonBgColor] = useState('');
  let graphBenchmarkTitle = props?.graphData.graph_report[0].graph_benchmark_title;
  let fundTitle = props?.graphData.graph_report[0].graph_fund_title;
  const productName = getConfig().productName;

  useEffect(() => {
    if (productName !== 'fisdom') {
      setButtonColor(config.styles.primaryColor);
      setButtonBgColor(config.styles.primaryColor);
    } else {
      setButtonColor('#4985E1');
      setButtonBgColor('#039');
    }
  }, []);
  const prevSelectedMonth = useRef();
  const sendEvents = (monthValue) => {
    if (prevSelectedMonth.current !== monthValue) {
      let eventObj = {
        event_name: 'fund_detail',
        properties: {
          investment_horizon: monthValue,
          channel: productName,
        },
      };

      nativeCallback({ events: eventObj });
    }
    prevSelectedMonth.current = monthValue;
  };
  let d2Series = [];
  let d1Series = [];
  let duration = 0;
  const chopDates = (dates1, dates2) => {
    let seriesAMin = dates1[0][0];
    let seriesAMax = dates1[dates1.length - 1][0];
    let enteredAmfi = false;
    let enteredBench = false;

    let seriesBMin = dates2[0][0];
    let seriesBMax = dates2[dates2.length - 1][0];
    let maximum = seriesAMax > seriesBMax ? seriesBMax : seriesAMax;
    let minimum = seriesAMin < seriesBMin ? seriesBMin : seriesAMin;
    let d1 = moment(minimum).utc();
    let d2 = moment(maximum).utc();

    let days = d2.diff(d1, 'days');

    if (days > 3 * 365) {
      duration = 5;
    } else if (days > 365 && days <= 3 * 365) {
      duration = 3;
    } else if (days > 30 * 6 && days <= 365) {
      duration = 1;
    } else if (days > 30 * 6 && days <= 365) {
      duration = 6;
    } else if (days > 30 * 3 && days <= 30 * 6) {
      duration = 3;
    } else if (days > 30 && days <= 30 * 3) {
      duration = 1;
    }

    let baseNavAmfi = '';
    for (let i = 0; i < dates1.length; i++) {
      if (dates1[i][0] > minimum && dates1[i][0] < maximum) {
        if (!enteredAmfi) {
          baseNavAmfi = fundGraph[i][1];
        }
        enteredAmfi = true;
        var dataValue = 100000 * (1 + (dates1[i][1] - baseNavAmfi) / baseNavAmfi);
        dates1[i][1] = dataValue;
        d1Series.push(dates1[i]);
      }
    }

    let baseNavBenchMark = '';
    for (let i = 0; i < dates2.length; i++) {
      if (dates2[i][0] > minimum && dates2[i][0] < maximum) {
        if (!enteredBench) {
          baseNavBenchMark = graphDataForBenchMark[i][1];
        }
        enteredBench = true;
        let dataValue = 100000 * (1 + (dates2[i][1] - baseNavBenchMark) / baseNavBenchMark);
        dates2[i][1] = dataValue;
        d2Series.push(dates2[i]);
      }
    }
  };
  chopDates(fundGraph, graphDataForBenchMark);

  const configPrice = {
    yAxis: {
      crosshair: false,
      min: 5000,
      labels: {
        formatter: function () {
          return (this.value > 0 ? ' Rs ' : '') + this.value;
        },
      },
      plotLines: [
        {
          value: 100000,
          width: 2,
        },
      ],
    },

    tooltip: {
      valueDecimals: 2,
      split: false,
      enabled: false,
      animation: true,
      shared: true,
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        states: {
          hover: {
            enabled: false,
            lineWidth: 0,
          },
        },
      },
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      lang: {
        rangeSelectorZoom: '',
      },
    },
    chart: {
      height: '230px',
      panning: false,
      pinchType: false,
      zoomType: '',
      zoomKey: '',
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
      itemStyle: {
        fontSize: '1px',
        font: '9pt Trebuchet MS, Verdana, sans-serif',
        color: '#555',

        fill: '#3792FC',
      },
      itemHoverStyle: {
        color: '#A1A1A1',
      },
      itemHiddenStyle: {
        color: '#444',
      },
      itemMarginBottom: -24,
      enabled: true,
      align: 'center',
      backgroundColor: '',
      borderWidth: 0,
      layout: 'horizontal',
      verticalAlign: 'bottom',
      shadow: false,
      itemDistance: 30,
    },
    xAxis: {
      crosshair: false,
      labels: {
        enabled: true,
        step: 1,
      },
      tickColor: '',
      tickLength: '',
      tickWidth: '',
    },
    rangeSelector: {
      selected: duration,
      inputEnabled: false,
      buttonPosition: {
        x: 0,
      },
      buttonTheme: {
        // styles for the buttons
        fill: 'none',
        stroke: 'none',
        'stroke-width': 0,
        r: 4,
        width: 35,
        style: {
          color: buttonColor,
          fontWeight: 'bold',
        },
        states: {
          hover: {},
          select: {
            fill: buttonBgColor,
            style: {
              color: 'white',
            },
          },
        },
      },
      labelStyle: {
        display: 'none',
      },
      buttons: [
        {
          type: 'month',
          count: 1,
          text: '1M',
          events: {
            click: function () {
              sendEvents('1m');
            },
          },
        },
        {
          type: 'month',
          count: 3,
          text: '3M',
          events: {
            click: function () {
              sendEvents('3m');
            },
          },
        },
        {
          type: 'month',
          count: 6,
          text: '6M',
          events: {
            click: function () {
              sendEvents('6m');
            },
          },
        },
        {
          type: 'year',
          count: 1,
          text: '1Y',
          events: {
            click: function () {
              sendEvents('1y');
            },
          },
        },
        {
          type: 'year',
          count: 3,
          text: '3Y',
          events: {
            click: function () {
              sendEvents('3y');
            },
          },
        },
        {
          type: 'year',
          count: 5,
          text: '5Y',
          events: {
            click: function () {
              sendEvents('5y');
            },
          },
        },
      ],
    },
    series: [
      {
        name: fundTitle,
        type: 'spline',

        data: d2Series,
        tooltip: {
          valueDecimals: 2,
        },
      },
      {
        name: graphBenchmarkTitle,
        type: 'spline',

        data: d1Series,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  return (
    <div>
      <ReactHighcharts config={configPrice}></ReactHighcharts>
    </div>
  );
};
const RenderChart = (props) => {
  const value = formatAmountInr(100000);
  return (
    <Report title={`Growth of ${value}`}>
      <div style={{ padding: '0 15px' }}>
        <FundChart graphData={props.graphData} />
      </div>
    </Report>
  );
};
export default memo(RenderChart);
