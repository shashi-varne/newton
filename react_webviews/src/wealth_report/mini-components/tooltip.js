import React from "react";
import { StatefulToolTip } from "react-portal-tooltip";

const Tooltip = () => {
  let style = {
    style: {
      background: "white",
      padding: 20,
      borderRadius: "10px",
      border: "0.5px solid rgba(151, 151, 151, 0.1)",
      boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.05)",
    },
    arrowStyle: {
      color: "white",
      borderColor: "rgba(0, 0, 0, 0.15)",
    },
  };

  const logo = (
    <img
      src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
      style={{ cursor: "pointer" }}
      alt=""
    />
  );

  return (
    <StatefulToolTip
      position="bottom"
      arrow="center"
      parent={logo}
      style={style}
    >
      <div style={{ width: "300px" }}>
        <div
          style={{
            fontSize: "15px",
            color: "#432088",
            fontWeight: "500",
            marginBottom: "4px",
          }}
        >
          XIRR ( Extended Internal Return Rate)
        </div>
        <div style={{ color: "#a9a9a9", fontSize: "15px", lineHeight: "20px" }}>
          XIRR or extended internal return rate is the standard return metricis
          for measuring the annual performance of the mutual funds
        </div>
      </div>
    </StatefulToolTip>
  );
};

export default Tooltip;
