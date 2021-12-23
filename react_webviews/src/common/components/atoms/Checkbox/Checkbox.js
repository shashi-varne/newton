import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { noop } from "lodash";

const CheckBox = (props) => {
  const {
    isSelected = false,
    isDisabled = false,
    onChange = noop,
    ...restProps
  } = props;
  return (
    <Checkbox
      disabled={isDisabled}
      checked={isSelected}
      onChange={onChange}
      {...restProps}
    />
  );
};

export default CheckBox;
