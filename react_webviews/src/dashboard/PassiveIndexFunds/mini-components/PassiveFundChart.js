import React from "react";
import ReactHighcharts from "react-highcharts/ReactHighstock.src";
import moment from "moment";
import $ from "jquery";
import "./commonStyles.scss";

ReactHighcharts.Highcharts.setOptions({
  lang: {
    rangeSelectorZoom: "",
  },
  colors: ["#7ED321", "#ffffff"],
});

ReactHighcharts.Highcharts.addEvent(
  ReactHighcharts.Highcharts.Axis,
  "afterDrawCrosshair",
  function (event) {
    if (this.cross) {
      $(this.cross.element)
        .detach()
        .insertAfter(this.chart.series[0].group.element);
    }
  }
);

const FundChart = (props) => {
  let format = props.xaxisFormat;
  let duration = 0;

  const configPrice = {
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
            (this.value > 0 ? "₹" : "") +
            this.value +
            "</p>"
          );
        },
      },
      gridLineColor: "#F7F3FF",
      title: {
        text: undefined,
      },
    },

    tooltip: {
      backgroundColor: null,
      borderWidth: 0,
      shape: "square",
      useHTML: true,
      formatter: function () {
        return (
          '<div class="tooltip-container"><p class="date"><b>' +
          moment(this.points[0].key).format("DD MMM YYYY").toUpperCase() +
          '</b></p><div class="next-line-container"><div><p class="dot"></p></div><p class="content">NAV: ₹</p><p class="content">' +
          this.y.toFixed(2) +
          "</p></div></div>"
        );
      },
    },
    plotOptions: {
      areaspline: {
        threshold: null,
        fillColor: {
          linearGradient: [0, 0, 0, 200],
          stops: [
            [
              0,
              ReactHighcharts.Highcharts.color(
                ReactHighcharts.Highcharts.getOptions().colors[0]
              )
                .setOpacity(0.6)
                .get("rgba"),
            ],
            [
              1,
              ReactHighcharts.Highcharts.color(
                ReactHighcharts.Highcharts.getOptions().colors[1]
              )
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        lineColor: "#7ED321",
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
      type: "areaspline",
      height: "250px",
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
      rangeSelectorZoom: "",
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
        color: "white",
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
            return (
              '<p class="xaxis-label">' +
              moment(this.pos).format("DD MMM YYYY") +
              "</p>"
            );
          if (this.isLast) return '<p class="xaxis-label">TODAY</p>';
          if (format === "yyyy")
            return (
              '<p class="xaxis-label">' +
              moment(this.pos).format("YYYY") +
              "</p>"
            );
          if (format === "ddmm")
            return (
              '<p class="xaxis-label">' +
              moment(this.pos).format("DD MMM") +
              "</p>"
            );
        },
      },
      tickColor: "",
      tickLength: 0,
      tickWidth: 0,
    },
    rangeSelector: {
      verticalAlign: "bottom",
      x: 0,
      y: 0,
      enabled: false,
      selected: duration,
      inputEnabled: false,
      buttonPosition: {
        align: "center",
        x: -50,
        y: 10,
      },
      buttonTheme: {
        fill: "#F0F7FF",
        stroke: "none",
        r: 4,
        width: 35,
        style: {
          color: "#767E86",
        },
        states: {
          hover: {},
          select: {
            fill: "#3792FC",
            style: {
              color: "white",
            },
          },
        },
      },
    },
    series: [
      {
        data: props.graphData,
      },
    ],
  };

  return (
    <div>
      <ReactHighcharts config={configPrice}></ReactHighcharts>
    </div>
  );
};
const RenderChart = ({ modifyCurrentReturns, graphData, xaxisFormat }) => {
  return (
    <div style={{ padding: "0 15px" }}>
      <FundChart
        xaxisFormat={xaxisFormat}
        graphData={graphData}
      />
    </div>
  );
};
export default RenderChart;
