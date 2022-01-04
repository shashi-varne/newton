import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import "./TimelineSingle.scss";

const activeStyles = {
  borderRadius: "50%",
  backgroundColor: "foundationColors.primary.brand",
  color: "foundationColors.supporting.white",
};

const inactiveStyles = {
  color: "foundationColors.content.tertiary",
};

const TimelineSingle = (props) => {
  const { text = "", className, isActive = false, dataAid } = props;

  return (
    <Typography
      className={`atom-timeline-single ${className}`}
      sx={isActive ? activeStyles : inactiveStyles}
      data-aid={`timelineSingle_${dataAid}`}
      variant={isActive ? "body3" : "body5"}
    >
      {text}
    </Typography>
  );
};

export default TimelineSingle;

TimelineSingle.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
};
