import React from "react";
import MuiBadge from "@mui/material/Badge";
import PropTypes from "prop-types";

const Badge = (props) => {
  const {
    children,
    badgeContent,
    dataAid,
    ...restProps
  } = props;
  return (
    <MuiBadge
      badgeContent={badgeContent}
      data-aid={`badge_${dataAid}`}
      // color="foundationColors.primary.brand"
      color={"primary"}
      {...restProps}
    >
    </MuiBadge>
  );
};

export default Badge;

Badge.propTypes = {
  badgeContent: PropTypes.number,
};
