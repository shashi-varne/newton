import React, { useMemo } from "react";
import { Box, Stack } from "@mui/material";
import PropTypes from "prop-types";
import "./ProgressBar.scss";

const getBarMeterData = (numberOfBars) => () => {
  return Array.from(Array(numberOfBars).keys());
};

const ProgressBar = (props) => {
  const { dataAid, className, activeIndex, numberOfBars } = props;

  const progressBarData = useMemo(getBarMeterData(numberOfBars), [
    numberOfBars,
  ]);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      spacing="4px"
      className={`atom-progress-bar ${className}`}
      data-aid={`progressBar_${dataAid}`}
    >
      {progressBarData.map((index) => (
        <Bar
          key={index}
          isActive={index === Number(activeIndex)}
          index={index + 1}
        />
      ))}
    </Stack>
  );
};

const Bar = ({ isActive = false, index }) => {
  return (
    <Box
      className="atom-bar"
      sx={{
        backgroundColor: isActive
          ? "foundationColors.primary.brand"
          : "foundationColors.supporting.athensGrey",
      }}
      data-aid={`progressBar_${index}`}
    />
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  activeIndex: PropTypes.number,
  classes: PropTypes.object,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
