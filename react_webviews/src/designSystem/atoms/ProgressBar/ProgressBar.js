import { Box } from "@mui/material";
import React from "react";
import "./ProgressBar.scss";
import PropTypes from "prop-types";

function ProgressBar({
  progressBackgroundColor,
  progressColor,
  percentage,
  dataAidSuffix,
}) {
  return (
    <Box
      data-aid={`progressBar_${dataAidSuffix}`}
      className="progress-container"
      sx={{
        backgroundColor: progressBackgroundColor
          ? progressBackgroundColor
          : "foundationColors.supporting.athensGrey",
      }}
    >
      <Box
        className="progress-percentage"
        sx={{
          width: `${percentage}%`,
          backgroundColor: progressColor
            ? progressColor
            : "foundationColors.supporting.cadetBlue",
        }}
      ></Box>
    </Box>
  );
}

ProgressBar.defaultProps = {
  progressBackgroundColor: "",
  progressColor: "",
  percentage: 0,
};

ProgressBar.proptypes = {
  progressBackgroundColor: PropTypes.string,
  progressColor: PropTypes.string,
  percentage: PropTypes.number,
};

export default ProgressBar;
