import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LabelColorMapper = {
  Equity: "#33CF90",
  Debt: "#FE794D",
  Others: "#FFBD00",
};

function AssetWiseGraph() {
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
            return `<span> <span style='color: ${LabelColorMapper[this.key]}'>${
              this.percentage
            }%</span> ${this.key} </span>`;
          },
          style: {},
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "100%"],
        size: "220%",
        colors: ["#33CF90", "#FE794D", "#FFBD00"],
      },
    },
    series: [
      {
        type: "pie",
        name: undefined,
        innerSize: "50%",
        data: [
          ["Equity", 60],
          ["Debt", 30],
          ["Others", 10],
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

export default AssetWiseGraph;
