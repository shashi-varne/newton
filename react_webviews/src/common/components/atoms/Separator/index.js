import React from "react";
import { Divider } from "@mui/material";
import PropTypes from "prop-types";

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

Separator.propTypes = {
  className: PropTypes.string,
  dataAid: PropTypes.string,
  variant: PropTypes.oneOf(Object.values(DIVIDER_VARIANTS)),
};
