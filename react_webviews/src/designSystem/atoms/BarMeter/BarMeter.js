import React, { useMemo } from "react";
import { Box, Stack } from "@mui/material";
import PropTypes from "prop-types";
import Typography from "../Typography";
import isObject from "lodash/isObject";
import isEmpty from "lodash/isEmpty";
import "./BarMeter.scss";

const getBarData =
  ({ isActive, data, displayKey, index, length }) =>
  () => {
    let backgroundColor, labelColor;
    if (isActive) {
      backgroundColor = "foundationColors.primary.brand";
      labelColor = "foundationColors.primary.brand";
    } else {
      backgroundColor = "foundationColors.primary.200";
      labelColor = "foundationColors.primary.300";
    }
    const labelName = isObject(data) ? data[displayKey] : data;
    const showLabel = !isEmpty(labelName) && ([1, length].includes(index) || isActive);
    return {
      showLabel,
      labelName,
      labelColor,
      backgroundColor,
    };
  };

const BarMeter = (props) => {
  const {
    dataAid,
    classes = {},
    activeIndex,
    barMeterData = [],
    displayKey = "name",
  } = props;

  return (
    <Stack
      direction="row"
      justifyContent="center"
      spacing="4px"
      className={`atom-bar-meter ${classes.container}`}
      data-aid={`barMeter_${dataAid}`}
    >
      {barMeterData.map((data, index) => (
        <Bar
          key={index}
          isActive={index === activeIndex}
          displayKey={displayKey}
          data={data}
          index={index + 1}
          length={barMeterData.length}
        />
      ))}
    </Stack>
  );
};

const Bar = ({ isActive = false, displayKey, data, index, length }) => {
  const barData = useMemo(
    getBarData({ isActive, data, displayKey, length, index }),
    [isActive, data, displayKey, length]
  );
  return (
    <Box className="atom-bar-content">
      <Box
        className="atom-bar"
        sx={{
          backgroundColor: barData.backgroundColor,
        }}
        data-aid={`iv_bar${index}`}
      />
      {barData.showLabel && (
        <Typography
          variant="body1"
          className="atom-bar-label"
          color={barData.labelColor}
          dataAid={`label${index}`}
        >
          {barData.labelName}
        </Typography>
      )}
    </Box>
  );
};

export default BarMeter;

BarMeter.propTypes = {
  activeIndex: PropTypes.number,
  classes: PropTypes.object,
  displayKey: PropTypes.string,
  barMeterData: PropTypes.array.isRequired,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
