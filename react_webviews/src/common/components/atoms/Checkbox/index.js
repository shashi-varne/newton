import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { noop } from "lodash";
import PropTypes from "prop-types";

const CheckBox = (props) => {
  const {
    isSelected = false,
    isDisabled = false,
    onChange = noop,
    dataAid, 
    ...restProps
  } = props;
  return (
    <Checkbox
      disabled={isDisabled}
      checked={isSelected}
      onChange={onChange}
      data-aid={`atom-checkbox-${dataAid}`}
      {...restProps}
    />
  );
};

export default CheckBox;

CheckBox.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
};
