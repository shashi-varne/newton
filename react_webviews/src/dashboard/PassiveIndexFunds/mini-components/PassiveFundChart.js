import React, { useRef } from "react";
import ReactHighcharts from "react-highcharts/ReactHighstock.src";
import moment from "moment";
import $ from "jquery";
import { nativeCallback } from "../../../utils/native_callback";
import { getConfig } from "../../../utils/functions";
import "./commonStyles.scss";
import { BUTTON_MAPPER } from "../constants";
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
  const fundGraph = props?.graphData.graph_report[0].graph_data_for_amfi;
  const productName = getConfig().productName;
  let format = "yyyy";
  let d1Series = [];
  let duration = 0;
  let buttonConfig = [];

  const prevSelectedMonth = useRef();
  const sendEvents = (monthValue) => {
    if (prevSelectedMonth.current !== monthValue) {
      let eventObj = {
        event_name: "fund_detail",
        properties: {
          investment_horizon: monthValue,
          channel: productName,
        },
      };

      nativeCallback({ events: eventObj });
    }
    prevSelectedMonth.current = monthValue;
  };

  const buttonConfigMapper = () => {
    BUTTON_MAPPER.forEach((item) => {
      let obj = {};
      obj.count = item.count;
      obj.type = item.type;
      obj.text = item.type === "year" ? `${item.count}Y` : `${item.count}M`;
      obj.events = {
        click: function () {
          format = item.type === "year" && item.count !== 1 ? "yyyy" : "ddmm";
          sendEvents(obj.text.toUpperCase());
        },
      };
      buttonConfig.push(obj);
    });
  };
  buttonConfigMapper();

  const chopDates = (dates1) => {
    let seriesAMin = dates1[0][0];
    let seriesAMax = dates1[dates1.length - 1][0];
    let maximum = seriesAMax;
    let minimum = seriesAMin;
    let d1 = moment(minimum).utc();
    let d2 = moment(maximum).utc();

    let days = d2.diff(d1, "days");
    if (days >= 5 * 365) {
      duration = 5;
    } else if (days >= 3 * 365) {
      duration = 4;
    } else if (days >= 365) {
      duration = 3;
    } else if (days >= 30 * 6) {
      duration = 2;
    } else if (days >= 30 * 3) {
      duration = 1;
    } else if (days >= 30) {
      duration = 0;
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
      enabled: true,
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
      buttons: [...buttonConfig],
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
