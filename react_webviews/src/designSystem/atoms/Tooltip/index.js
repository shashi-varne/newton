import React, { useMemo } from "react";
import MuiTooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Typography from "../Typography";
import isEmpty from "lodash/isEmpty";

export const TOOLTIP_PLACEMENTS = {
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

export const TOOLTIP_VARIANTS = {
  DEFAULT: "default",
  SUBTITLE: "subtitle",
};

const tooltipStyles = {
  textAlign: "left",
  padding: "0px 8px",
};

const TooltipDescription = ({ title, description }) => {
  const styles = useMemo(
    () => (!isEmpty(title) && !isEmpty(description) ? tooltipStyles : {}),
    [title, description]
  );
  return (
    <Box sx={styles}>
      {!isEmpty(title) && (
        <Typography
          variant="body1"
          color="foundationColors.supporting.white"
          data-aid="tv_title"
        >
          {title}
        </Typography>
      )}
      {!isEmpty(description) && (
        <Typography
          variant="body2"
          color="foundationColors.supporting.white"
          data-aid="tv_subtitle"
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

const Tooltip = (props) => {
  const {
    title = "",
    description = "",
    children,
    dataAid = "",
    arrow = false,
    placement = TOOLTIP_PLACEMENTS.BOTTOM,
    ...restProps
  } = props;
  return (
    <MuiTooltip
      title={TooltipDescription({ title, description })}
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
