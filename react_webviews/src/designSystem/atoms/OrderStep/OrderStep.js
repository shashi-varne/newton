import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import "./OrderStep.scss";

export const ORDER_STEP_VARIANTS = {
  DEFAULT: "DEFAULT",
  PROCESSING: "PROCESSING",
  SUCCESSFUL: "SUCCESSFUL",
};

const VARIANT_COLOR_MAPPER = {
  DEFAULT: "foundationColors.supporting.gainsboro",
  PROCESSING: "foundationColors.secondary.mango.400",
  SUCCESSFUL: "foundationColors.secondary.profitGreen.400",
};

const OrderStep = (props) => {
  const {
    className,
    title = "",
    subtitle = "",
    stepContent = "",
    dataAid,
    children,
    variant = ORDER_STEP_VARIANTS.DEFAULT,
  } = props;

  return (
    <Box
      className={`atom-order-step ${className}`}
      data-aid={`orderStep_${dataAid}`}
    >
      <Box
        className="aos-circle"
        sx={{
          backgroundColor:
            VARIANT_COLOR_MAPPER[variant] ||
            VARIANT_COLOR_MAPPER[ORDER_STEP_VARIANTS.DEFAULT],
        }}
      >
        <Typography
          variant="body1"
          className="aos-step-content"
          color="foundationColors.supporting.white"
        >
          {stepContent}
        </Typography>
      </Box>
      <Box>
        {!isEmpty(title) && (
          <Typography variant="body1" className="aos-title">
            {title}
          </Typography>
        )}
        {!isEmpty(subtitle) && (
          <Typography
            variant="body2"
            className="aos-subtitle"
            color="foundationColors.content.secondary"
          >
            {subtitle}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default OrderStep;

OrderStep.propTypes = {
  variant: PropTypes.oneOf(Object.values(ORDER_STEP_VARIANTS)),
  dataAid: PropTypes.string,
  className: PropTypes.string,
  stepContent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
