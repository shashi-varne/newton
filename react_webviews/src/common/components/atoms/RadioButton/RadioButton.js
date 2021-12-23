import React from "react";
import Radio from "@mui/material/Radio";
import { noop } from "lodash";

const RadioButton = (props) => {
  const {
    isSelected = false,
    isDisabled = false,
    onChange = noop,
    ...restProps
  } = props;
  return (
    <Radio
      disabled={isDisabled}
      checked={isSelected}
      onChange={onChange}
      {...restProps}
    />
  );
};

export default RadioButton;
