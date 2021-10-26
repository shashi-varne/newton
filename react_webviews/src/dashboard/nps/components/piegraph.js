import React from 'react';
import ReactHighcharts from "react-highcharts";

const PieChart = (props) => {
  const { width = 120, height = 120 } = props;
  const config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      height: height,
      width: width
    },
    title: {
      text: ""
  },
    tooltip: {
      enabled: true,
      pointFormat: ''
    },
    plotOptions: {
      series: {
        states: {
          hover: {
            enabled: false
          }
        }
      },
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false
        },
        point: {
          events: {
            legendItemClick: () => false
          }
        },
        showInLegend: false,
        borderWidth: 0,
        size:100
      }
    },
    series: [
      {
        innerSize: "55%",
        data: props.data
      }
    ],
    credits: {
      enabled: false
    }
  };
  return(
    <ReactHighcharts config={config} />
    )
}
export default PieChart;