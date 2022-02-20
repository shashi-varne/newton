import React, { useMemo } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "../../atoms/Typography";
import PropTypes from "prop-types";
import noop from "lodash/noop";
import isObject from "lodash/isObject";
import "./NavigationPopup.scss";

const NavigationPopup = (props) => {
  const {
    anchorEl,
    onClose = noop,
    options = [],
    dataAid,
    handleClick = noop,
    displayKey = "name",
    activeIndex,
    anchorOriginVertical = "bottom",
    anchorOriginHorizontal = "center",
    transformOriginVertical = "bottom",
    transformOriginHorizontal = "center",
    labelColor,
    dotColor,
  } = props;

  const onLabelClick = (index) => () => {
    handleClick(index);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: anchorOriginVertical,
        horizontal: anchorOriginHorizontal,
      }}
      transformOrigin={{
        vertical: transformOriginVertical,
        horizontal: transformOriginHorizontal,
      }}
      data-aid={`navigationPopup_${dataAid}`}
      className="molecule-navigation-popup"
    >
      {options.map((data, index) => (
        <Label
          key={index}
          index={index + 1}
          onClick={onLabelClick(index)}
          isActive={index === activeIndex}
          data={data}
          displayKey={displayKey}
          labelColor={labelColor}
          dotColor={dotColor}
        />
      ))}
    </Popover>
  );
};

const getLabelName = (data, displayKey) => () => {
  return isObject(data) ? data[displayKey] : data;
};

const Label = ({
  index,
  onClick,
  data,
  isActive,
  displayKey,
  labelColor,
  dotColor = "foundationColors.content.primary",
}) => {
  const labelName = useMemo(getLabelName(data, displayKey), [data]);
  return (
    <Box className="np-label-wrapper" onClick={onClick}>
      {isActive && (
        <Typography variant='body3' sx={{mr:'4px'}} color={dotColor}>{'\u2022'}</Typography>
      )}
      <Typography
        dataAid={`label${index}`}
        variant={isActive ? "heading4" : "body8"}
        color={labelColor}
      >
        {labelName}
      </Typography>
    </Box>
  );
};

export default NavigationPopup;

NavigationPopup.propTypes = {
  onClose: PropTypes.func,
  dotColor: PropTypes.string,
  labelColor: PropTypes.string,
  displayKey: PropTypes.string,
  activeIndex: PropTypes.number,
  options: PropTypes.array.isRequired,
  anchorOriginVertical: PropTypes.string,
  anchorOriginHorizontal: PropTypes.string,
  transformOriginVertical: PropTypes.string,
  transformOriginHorizontal: PropTypes.string,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
