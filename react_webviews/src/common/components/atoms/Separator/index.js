import React from "react";
import { Divider } from "@mui/material";

export const DIVIDER_VARIANTS = {
  FULL_WIDTH: "fullWidth",
  INSET: "inset",
  MIDDLE: "middle",
};

const Separator = (props) => {
  const {
    className,
    variant = DIVIDER_VARIANTS.FULL_WIDTH,
    dataAid,
    children,
    ...restProps
  } = props;
  return (
    <Divider
      className={`atom-separator ${className}`}
      data-aid={`atom-separator-${dataAid}`}
      variant={variant}
      {...restProps}
    >
      {children}
    </Divider>
  );
};

export default Separator;
