import React from 'react';
// import { ResponsivePie } from '@nivo/pie';
import ReactHighcharts from "react-highcharts";
// export default function PieChart (props) {
//   const { width = 0, height = 0, ...otherProps } = props;
  
//   return (
//     // Require a container div since ResponsivePieChart fit to size of its contianer
//     <div style={{ width: `${width}px`, height: `${height}px` }}>
//       <ResponsivePie
//         data={props.data}
//         innerRadius={0.6}
//         enableRadialLabels={false}
//         enableSliceLabels={false}
//         padAngle={1}
//         animate={true}
//         colors={{ datum: 'data.color' }}
//         {...otherProps}
//       />
//     </div>
//   );
// }


const PieChart = (props) => {
  const { width = 120, height = 120, ...otherProps } = props;
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