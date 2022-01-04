import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
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
  const {
    title = "",
    className,
    children,
    variant,
    dataAid,
    ...restProps
  } = props;

  return (
    <Box
      className={`atom-status ${className}`}
      data-aid={`status_${dataAid}`}
      {...restProps}
    >
      <Box
        className="as-circle"
        sx={{
          backgroundColor: VARIANT_COLOR_MAPPER[variant],
        }}
      />
      <Box className="as-content">
        <Typography
          variant="body4"
          color={VARIANT_COLOR_MAPPER[variant]}
          allcaps
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default Status;

Status.propTypes = {
  variant: PropTypes.oneOf(Object.values(STATUS_VARIANTS)),
};
