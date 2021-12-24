import React from "react";
import Radio from "@mui/material/Radio";
import { noop } from "lodash";
import PropTypes from "prop-types";

const RadioButton = (props) => {
  const {
    isSelected = false,
    isDisabled = false,
    onChange = noop,
    dataAid = "",
    ...restProps
  } = props;
  return (
    <Radio
      disabled={isDisabled}
      checked={isSelected}
      onChange={onChange}
      data-aid={`atom-radio-button-${dataAid}`}
      {...restProps}
    />
  );
};

export default RadioButton;

RadioButton.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
}