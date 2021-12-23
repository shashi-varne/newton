import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import color from "../../../../theme/colors";
import "./Timeline.scss";

const activeStyles = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: color.primary.brand,
  color: color.supporting.white,
};

const inActiveStyles = {
  color: color.content.tertiary,
};

const Timeline = (props) => {
  const { text = "", className, isActive = false } = props;

  return (
    <Box
      className={`atom-timeline ${className}`}
      sx={isActive ? activeStyles : inActiveStyles}
    >
      {text}
    </Box>
  );
};

export default Timeline;

Timeline.propTypes = {
  isActive: PropTypes.bool,
  className: PropTypes.string,
};
