import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function SemiDonutGraph({ data }) {
  const graphOptions = {
    chart: {
      backgroundColor: "#F8F8FA",
      height: "180px",
      panning: false,
      zoomType: false,
      pinchType: false,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: 25,
          softConnector: false,
          style: {
            fontWeight: "bold",
            color: "white",
          },
          formatter: function () {
            return `<span> <span style='color: ${this.color}'>${parseInt(
              this.percentage
            )}%</span> ${this.key} </span>`;
          },
          style: {},
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "100%"],
        size: "220%",
        colors: data?.colors,
      },
    },
    series: [
      {
        type: "pie",
        name: undefined,
        innerSize: "50%",
        data: data?.seriesData,
      },
    ],
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={graphOptions} />
    </div>
  );
}

export default SemiDonutGraph;
