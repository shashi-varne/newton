import { Stack } from "@mui/material";
import ProgressBar from "designSystem/atoms/ProgressBar";
import Typography from "designSystem/atoms/Typography";
import React from "react";
import Proptypes from "prop-types";

function ProgressInfo({
  title,
  label,
  percentage,
  progressBackgroundColor,
  progressColor,
}) {
  const progressBarProps = {
    progressBackgroundColor,
    progressColor,
    percentage,
  };
  return (
    <div data-aid="progressInfo">
      <Stack direction="row" alignItems="ceter" justifyContent="space-between">
        <Typography variant="body8" dataAid="key">
          {title}
        </Typography>
        <Typography variant="body8" dataAid="value">
          {label}
        </Typography>
      </Stack>
      <ProgressBar {...progressBarProps} />
    </div>
  );
}

ProgressInfo.defaultProps = {
  title: "",
  label: "",
  percentage: 0,
  progressBackgroundColor: "",
  progressColor: "",
};

ProgressInfo.propTypes = {
  title: Proptypes.string,
  label: Proptypes.string,
  percentage: Proptypes.number,
  progressBackgroundColor: Proptypes.string,
  progressColor: Proptypes.string,
};

export default ProgressInfo;
