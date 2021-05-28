import React from 'react';
import ReactHighcharts from 'react-highcharts/ReactHighstock.src';
import moment from 'moment';

const FundChart = (props) => {
  const fundGraph = props?.graphData.graph_report[0].graph_data_for_amfi;

  let d1Series = [];
  let duration = 0;
  const chopDates = (dates1) => {
    let seriesAMin = dates1[0][0];
    let seriesAMax = dates1[dates1.length - 1][0];
    let maximum = seriesAMax;
    let minimum = seriesAMin;
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

    for (let i = 0; i < dates1.length; i++) {
      if (dates1[i][0] > minimum && dates1[i][0] < maximum) {
        d1Series.push(dates1[i]);
      }
    }
  };
  chopDates(fundGraph);

  const configPrice = {
    yAxis: {
      crosshair: false,
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
          fontWeight: 'bold',
        },
        states: {
          hover: {},
          select: {
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
        },
        {
          type: 'month',
          count: 3,
          text: '3M',
        },
        {
          type: 'month',
          count: 6,
          text: '6M',
        },
        {
          type: 'year',
          count: 1,
          text: '1Y',
        },
        {
          type: 'year',
          count: 3,
          text: '3Y',
        },
        {
          type: 'year',
          count: 5,
          text: '5Y',
        },
      ],
    },
    series: [
      {
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
  return (
      <div style={{ padding: '0 15px' }}>
        <FundChart graphData={props.graphData} />
      </div>
  );
};
export default RenderChart;
