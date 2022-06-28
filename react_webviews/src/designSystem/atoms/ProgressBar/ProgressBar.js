import { Box, Stack } from "@mui/material";
import React from "react";
import "./ProgressBar.scss";
import PropTypes, { number, string } from "prop-types";
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
  console.log(titleColor, labelColor);
  return (
    <Box
      data-aid={`progressBar_${dataAidSuffix}`}
      className="progress-container"
    >
      {(!!title || !!label) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="text-row"
        >
          <Typography
            variant="body8"
            color={{ color: titleColor }}
            dataAid="tv_key"
          >
            {title}
          </Typography>
          <Typography
            variant="body8"
            color={{ color: labelColor }}
            dataAid="tv_value"
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
