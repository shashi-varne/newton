import React from "react";
import { Box } from "@mui/material";
import color from "../../../../theme/colors";
import PropTypes from "prop-types";
import "./BarMeter.scss";

const BarMeter = (props) => {
  const { classes = {}, dataAid, numberOfBars = 5, activeIndex } = props;
  return (
    <Box
      className={`atom-bar-meter ${classes.container}`}
      data-aid={`atom-bar-meter-${dataAid}`}
    >
      {Array.from(Array(numberOfBars).keys()).map((element) => (
        <Bar
          key={element}
          className={classes.bar}
          dataAid={dataAid}
          isActive={element === activeIndex}
        />
      ))}
    </Box>
  );
};

const Bar = ({ isActive = false, className, dataAid }) => {
  return (
    <Box
      className={`atom-bar ${className}`}
      sx={{
        backgroundColor: isActive ? color.primary.brand : color.primary[200],
      }}
      data-aid={`atom-bar-${dataAid}`}
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
