import React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import { noop } from "lodash";
import PropTypes from "prop-types";

const Checkbox = (props) => {
  const {
    isSelected = false,
    isDisabled = false,
    onChange = noop,
    dataAid, 
    ...restProps
  } = props;
  return (
    <MuiCheckbox
      disabled={isDisabled}
      checked={isSelected}
      onChange={onChange}
      data-aid={`checkbox_${dataAid}`}
      {...restProps}
    />
  );
};

export default Checkbox;

Checkbox.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
};
