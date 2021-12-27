import React from "react";
import Tooltip from "@mui/material/Tooltip";

const ToolTip = (props) => {
  const { title = "", children, dataAid = "", ...restProps } = props;
  return (
    <Tooltip title={title} dataAid={`tooltip_${dataAid}`} {...restProps}>
      {children}
    </Tooltip>
  );
};

export default ToolTip;
