import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import "./Timeline.scss";

const activeStyles = {
  borderRadius: "50%",
  backgroundColor: "foundationColors.primary.brand",
  color: "foundationColors.supporting.white",
};

const inactiveStyles = {
  color: "foundationColors.content.tertiary",
};

const Timeline = (props) => {
  const { text = "", className, isActive = false, dataAid } = props;

  return (
    <Typography
      className={`atom-timeline ${className}`}
      sx={isActive ? activeStyles : inactiveStyles}
      data-aid={`timeline_${dataAid}`}
      variant={isActive ? "body3" : "body5"}
    >
      {text}
    </Typography>
  );
};

export default Timeline;

Timeline.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
};
