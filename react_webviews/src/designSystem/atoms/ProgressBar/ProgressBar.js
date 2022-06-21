import { Box, Stack } from "@mui/material";
import React from "react";
import "./ProgressBar.scss";
import PropTypes from "prop-types";
import Typography from "../Typography";

function ProgressBar({
  progressBackgroundColor,
  progressColor,
  percentage,
  dataAidSuffix,
  title,
  label,
}) {
  return (
    <Box
      data-aid={`progressBar_${dataAidSuffix}`}
      className="progress-container"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className="text-row"
      >
        <Typography
          variant="body8"
          style={{ color: "foundationColors.content.primary" }}
          dataAid="tv_key"
        >
          {title}
        </Typography>
        <Typography
          variant="body8"
          style={{ color: "foundationColors.content.primary" }}
          dataAid="tv_value"
        >
          {label}
        </Typography>
      </Stack>
      <Box
        className="progress-bar-container"
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
    </Box>
  );
}

ProgressBar.defaultProps = {
  progressBackgroundColor: "",
  progressColor: "",
  percentage: 0,
  title: "",
  label: "",
};

ProgressBar.proptypes = {
  progressBackgroundColor: PropTypes.string,
  progressColor: PropTypes.string,
  percentage: PropTypes.number,
  title: PropTypes.string,
  label: PropTypes.string,
};

export default ProgressBar;
