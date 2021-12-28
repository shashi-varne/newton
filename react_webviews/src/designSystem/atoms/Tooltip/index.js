import React from "react";
import MuiTooltip from "@mui/material/Tooltip";

const Tooltip = (props) => {
  const { title = "", children, dataAid = "", ...restProps } = props;
  return (
    <MuiTooltip title={title} dataAid={`tooltip_${dataAid}`} {...restProps}>
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
