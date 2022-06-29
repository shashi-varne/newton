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
  titleColor,
  labelColor,
}) {
  return (
    <Box
      data-aid={`progressBar_${dataAidSuffix}`}
      className="progress-container"
    >
      {(!!title || !!label) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={!title ? "flex-start" : "space-between"}
          className="text-row"
        >
          <Typography
            variant="body8"
            color={{ color: titleColor }}
            dataAid="key"
          >
            {title}
          </Typography>
          <Typography
            variant="body8"
            color={{ color: labelColor }}
            dataAid="value"
          >
            {label}
          </Typography>
        </Stack>
      )}
      <Box
        className="progress-bar-container"
        sx={{ backgroundColor: progressBackgroundColor }}
      >
        <Box
          className="progress-percentage"
          sx={{ width: `${percentage}%`, backgroundColor: progressColor }}
        ></Box>
      </Box>
    </Box>
  );
}

ProgressBar.defaultProps = {
  progressBackgroundColor: "foundationColors.supporting.athensGrey",
  progressColor: "foundationColors.supporting.cadetBlue",
  percentage: 0,
  title: "",
  label: "",
  dataAidSuffix: "",
  titleColor: "foundationColors.content.primary",
  labelColor: "foundationColors.content.primary",
};

ProgressBar.propTypes = {
  progressBackgroundColor: PropTypes.string,
  progressColor: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  title: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  label: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  dataAidSuffix: PropTypes.string.isRequired,
  titleColor: PropTypes.string,
  labelColor: PropTypes.string,
};

export default ProgressBar;
