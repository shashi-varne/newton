import React from "react";
import Tooltip from "@mui/material/Tooltip";

const ToolTip = (props) => {
  const { title = "", children, ...restProps } = props;
  return (
    <Tooltip title={title} {...restProps}>
      {children}
    </Tooltip>
  );
};

export default ToolTip;
