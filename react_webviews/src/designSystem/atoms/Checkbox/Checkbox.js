import React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import { noop } from "lodash";
import PropTypes from "prop-types";

const Checkbox = (props) => {
  const {
    checked = false,
    disabled = false,
    onChange = noop,
    value = "",
    dataAid,
    ...restProps
  } = props;
  return (
    <MuiCheckbox
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      value={value}
      data-aid={`checkbox_${dataAid}`}
      {...restProps}
    />
  );
};

export default Checkbox;

Checkbox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
