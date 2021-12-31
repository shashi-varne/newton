import React from "react";
import Radio from "@mui/material/Radio";
import { noop } from "lodash";
import PropTypes from "prop-types";

const RadioButton = (props) => {
  const {
    isChecked = false,
    isDisabled = false,
    onChange = noop,
    dataAid = "",
    ...restProps
  } = props;
  return (
    <Radio
      disabled={isDisabled}
      checked={isChecked}
      onChange={onChange}
      data-aid={`radioButton_${dataAid}`}
      {...restProps}
    />
  );
};

export default RadioButton;

RadioButton.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
}