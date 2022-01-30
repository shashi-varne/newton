import React, { useMemo } from "react";
import Popover from "@mui/material/Popover";
import Typography from "../../atoms/Typography";
import PropTypes from "prop-types";
import noop from "lodash/noop";
import isObject from "lodash/isObject";
import "./NavigationPopup.scss";
import { Box } from "@mui/material";

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
        />
      ))}
    </Popover>
  );
};

const getLabelName = (data, displayKey) => () => {
  return isObject(data) ? data[displayKey] : data;
};

const Label = ({ index, onClick, data, isActive, displayKey }) => {
  const labelName = useMemo(getLabelName(data, displayKey), [data]);
  return (
    <Box className="np-label-wrapper">
      {isActive && (
        <Box
          className="np-lw-dot"
          sx={{ backgroundColor: "foundationColors.content.primary" }}
        />
      )}
      <Typography
        dataAid={`label${index}`}
        variant={isActive ? "heading4" : "body8"}
        component="div"
        color="foundationColors.content.primary"
        onClick={onClick}
      >
        {labelName}
      </Typography>
    </Box>
  );
};

export default NavigationPopup;

NavigationPopup.propTypes = {
  onClose: PropTypes.func,
  options: PropTypes.array.isRequired,
  activeIndex: PropTypes.number,
  displayKey: PropTypes.string,
  anchorOriginVertical: PropTypes.string,
  anchorOriginHorizontal: PropTypes.string,
  transformOriginVertical: PropTypes.string,
  transformOriginHorizontal: PropTypes.string,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
