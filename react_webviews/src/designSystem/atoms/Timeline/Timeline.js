import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import "./Timeline.scss";

const activeStyles = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "foundationColors.primary.brand",
  color: "foundationColors.supporting.white",
};

const inActiveStyles = {
  color: "foundationColors.content.tertiary",
};

const Timeline = (props) => {
  const { text = "", className, isActive = false, dataAid } = props;

  return (
    <Box
      className={`atom-timeline ${className}`}
      sx={isActive ? activeStyles : inActiveStyles}
      data-aid={`timeline_${dataAid}`}
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
