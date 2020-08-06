import React from "react";
import { StatefulToolTip } from "react-portal-tooltip";

const Tooltip = (props) => {
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

  return (
    <StatefulToolTip
      position="bottom"
      arrow="center"
      parent={props.tip}
      style={style}
    >
      {props.content}
    </StatefulToolTip>
  );
};

export default Tooltip;
