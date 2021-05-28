import React, { useState } from "react";
import ReactHighcharts from "react-highcharts/ReactHighstock.src";
import "./commonStyles.scss";
import moment from "moment";
import $ from "jquery";

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
  const [format, setFormat] = useState("yyyy");
  const fundGraph = props?.graphData.graph_report[0].graph_data_for_amfi;
  function calculateDurationType(max, min) {
    var TotalDiff = max - min;
    TotalDiff /= 60 * 60 * 24 * 1000;
    var days = Math.abs(Math.round(TotalDiff));
    if (days > 3 * 365) {
      setFormat("yyyy");
    } else if (days > 365 && days <= 3 * 365) {
      setFormat("yyyy");
    } else if (days > 30 * 6 && days <= 365) {
      setFormat("ddmm");
    } else if (days > 30 * 6 && days <= 365) {
      setFormat("ddmm");
    } else if (days > 30 * 3 && days <= 30 * 6) {
      setFormat("ddmm");
    } else if (days > 30 && days <= 30 * 3) {
      setFormat("ddmm");
    }
  }
  let d1Series = [];
  let duration = 0;
  const chopDates = (dates1) => {
    let seriesAMin = dates1[0][0];
    let seriesAMax = dates1[dates1.length - 1][0];
    let maximum = seriesAMax;
    let minimum = seriesAMin;
    let d1 = moment(minimum).utc();
    let d2 = moment(maximum).utc();

    let days = d2.diff(d1, "days");

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
    title: {
      text: undefined,
    },
    yAxis: {
      opposite: false,
      crosshair: false,
      labels: {
        formatter: function () {
          return (
            '<p class="yaxis-label">' +
            (this.value > 0 ? " Rs " : "") +
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
        // calculateDurationType(this.min, this.max)
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
              moment(this.pos).format("DD MMM") +
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
      enabled: true,
      selected: duration,
      inputEnabled: false,
      buttonPosition: {
        align: "center",
        x: -50,
        y: 10,
      },
      buttonTheme: {
        fill: "none",
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
      buttons: [
        {
          type: "month",
          count: 1,
          text: "1M",
        },
        {
          type: "month",
          count: 3,
          text: "3M",
        },
        {
          type: "month",
          count: 6,
          text: "6M",
        },
        {
          type: "year",
          count: 1,
          text: "1Y",
        },
        {
          type: "year",
          count: 3,
          text: "3Y",
        },
        {
          type: "year",
          count: 5,
          text: "5Y",
        },
      ],
    },
    series: [
      {
        data: d1Series,
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
    <div style={{ padding: "0 15px" }}>
      <FundChart graphData={props.graphData} />
    </div>
  );
};
export default RenderChart;
