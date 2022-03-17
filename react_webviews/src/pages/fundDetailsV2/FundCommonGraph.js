import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import isEmpty from 'lodash/isEmpty';
import { Box, Skeleton } from '@mui/material';
import getTheme from '../../theme';

import './FundGraph.scss';

const FundCommonGraph = ({
  isGraphLoading,
  graphData,
  labelFormatter,
  tooltipFormatter,
  isRollingReturn = false,
}) => {
  const theme = getTheme();
  Highcharts.setOptions({
    lang: {
      rangeSelectorZoom: '',
    },
    colors: [theme?.palette?.foundationColors?.primary?.brand, '#ffffff'],
  });
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
          return (
            '<p class="yaxis-label">' +
            (this.value > 0 && !isRollingReturn ? '₹' : '') +
            this.value +
            (isRollingReturn ? '%' : '') +
            '</p>'
          );
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
      formatter: tooltipFormatter,
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
        formatter: labelFormatter,
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
  if (isGraphLoading || isEmpty(graphData))
    return (
      <Box sx={{ px: 2 }}>
        <Skeleton
          variant='rectangular'
          height='290px'
          width='100%'
          sx={{ borderRadius: 1, backgroundColor: 'foundationColors.primary.200' }}
        />
      </Box>
    );
  return (
    <div className='common-graph-wrapper'>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default FundCommonGraph;
