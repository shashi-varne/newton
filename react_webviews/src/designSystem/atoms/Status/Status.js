import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import "./Status.scss";

export const STATUS_VARIANTS = {
  POSITIVE: "POSITIVE",
  ATTENTION: "ATTENTION",
  WARNING: "WARNING",
};

const VARIANT_COLOR_MAPPER = {
  POSITIVE: "foundationColors.secondary.profitGreen.300",
  ATTENTION: "foundationColors.secondary.mango.400",
  WARNING: "foundationColors.secondary.lossRed.400",
};

const Status = (props) => {
  const { title = "", className, children, variant, dataAid, } = props;

  return (
    <Box className={`atom-status ${className}`} data-aid={`status_${dataAid}`} >
      <Box
        className="as-circle"
        sx={{
          backgroundColor: VARIANT_COLOR_MAPPER[variant],
        }}
      />
      <Box className="as-content">
        <Box
          className="as-title"
          sx={{
            color: VARIANT_COLOR_MAPPER[variant],
          }}
        >
          {title}
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default Status;

Status.propTypes = {
  variant: PropTypes.oneOf(Object.values(STATUS_VARIANTS)),
};
