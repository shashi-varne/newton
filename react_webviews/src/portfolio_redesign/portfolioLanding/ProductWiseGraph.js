import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LabelColorMapper = {
  Stocks: "#5AAAF6",
  NPS: "#ADB1C3",
};

function ProductWiseGraph() {
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
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: 25,
          style: {
            fontWeight: "bold",
            color: "white",
          },
          formatter: function () {
            return `<span> <span style='color: ${
              LabelColorMapper[this.key] || "#B99EFF"
            }'>${this.percentage}%</span> ${this.key} </span>`;
          },
          style: {},
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "100%"],
        size: "220%",
        colors: ["#5AAAF6", "#B99EFF", "#ADB1C3"],
      },
    },
    series: [
      {
        type: "pie",
        name: undefined,
        innerSize: "50%",
        data: [
          ["Stocks", 30],
          ["Mutual funds", 60],
          ["NPS", 10],
        ],
      },
    ],
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={graphOptions} />
    </div>
  );
}

export default ProductWiseGraph;
