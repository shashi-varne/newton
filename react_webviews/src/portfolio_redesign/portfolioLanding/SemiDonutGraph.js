import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { capitalizeFirstLetter } from "../../utils/validators";

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
          distance: 20,
          softConnector: false,
          
          formatter: function () {
            return `<span> <span style='color: ${
              this.color
            }'>${this.percentage.toFixed(2)}%</span> ${capitalizeFirstLetter(
              this.key?.toLowerCase()
            )} </span>`;
          },
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "100%"],
        size: "190%",
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
