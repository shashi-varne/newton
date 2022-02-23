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
    variant = DIVIDER_VARIANTS.FULL_WIDTH,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    dataAid,
    children,
    ...restProps
  } = props;
  return (
    <Divider
      data-aid={`separator_${dataAid}`}
      sx={{ marginTop, marginBottom, marginLeft, marginRight }}
      variant={variant}
      {...restProps}
    >
      {children}
    </Divider>
  );
};

export default Separator;

Separator.propTypes = {
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(Object.values(DIVIDER_VARIANTS)),
};
