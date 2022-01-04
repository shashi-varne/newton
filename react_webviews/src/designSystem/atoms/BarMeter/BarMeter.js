import React, { useMemo } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import "./BarMeter.scss";

const getBarMeterData = (numberOfBars) => () => {
  return Array.from(Array(numberOfBars).keys());
};

const BarMeter = (props) => {
  const { classes = {}, dataAid, numberOfBars = 5, activeIndex } = props;
  const barMeterData = useMemo(getBarMeterData(numberOfBars), [numberOfBars]);

  return (
    <Box
      className={`atom-bar-meter ${classes.container}`}
      data-aid={`barMeter_${dataAid}`}
    >
      {barMeterData.map((element) => (
        <Bar
          key={element}
          className={classes.bar}
          isActive={element === activeIndex}
        />
      ))}
    </Box>
  );
};

const Bar = ({ isActive = false, className }) => {
  return (
    <Box
      className={`atom-bar ${className}`}
      sx={{
        backgroundColor: isActive ? "foundationColors.primary.brand" : "foundationColors.primary.200",
      }}
    />
  );
};

export default BarMeter;

BarMeter.propTypes = {
  activeIndex: PropTypes.number,
  numberOfBars: PropTypes.number,
  classes: PropTypes.object,
  dataAid: PropTypes.string,
};
