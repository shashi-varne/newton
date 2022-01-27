import React from "react";
import MuiBadge from "@mui/material/Badge";
import PropTypes from "prop-types";

export const BADGE_VARIANTS = {
  DOT: "dot",
  STANDARD: "standard",
};

const Badge = (props) => {
  const {
    dataAid,
    children,
    badgeContent,
    variant = BADGE_VARIANTS.STANDARD,
    ...restProps
  } = props;
  return (
    <MuiBadge
      variant={variant}
      badgeContent={badgeContent}
      data-aid={`badge_${dataAid}`}
      {...restProps}
    >
      {children}
    </MuiBadge>
  );
};

export default Badge;

Badge.propTypes = {
  badgeContent: PropTypes.number,
  variant: PropTypes.oneOf(Object.values(BADGE_VARIANTS)),
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
