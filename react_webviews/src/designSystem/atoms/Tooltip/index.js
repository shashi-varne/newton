import React from "react";
import MuiTooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";

const TOOLTIP_PLACEMENTS = {
  BOTTOM_END: "bottom-end",
  BOTTOM_START: "bottom-start",
  BOTTOM: "bottom",
  LEFT_END: "left-end",
  LEFT_START: "left-start",
  LEFT: "left",
  RIGHT_END: "right-end",
  RIGHT_START: "right-start",
  RIGHT: "right",
  TOP_END: "top-end",
  TOP_START: "top-start",
  TOP: "top",
};

const Tooltip = (props) => {
  const {
    title = "",
    children,
    dataAid = "",
    arrow = false,
    placement = TOOLTIP_PLACEMENTS.BOTTOM,
    ...restProps
  } = props;
  return (
    <MuiTooltip
      title={title}
      arrow={arrow}
      placement={placement}
      data-aid={`tooltip_${dataAid}`}
      {...restProps}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;

Tooltip.propTypes = {
  arrow: PropTypes.bool,
  placement: PropTypes.oneOf(Object.values(TOOLTIP_PLACEMENTS)),
};
