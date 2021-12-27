import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import color from "../../../../theme/colors";
import { isEmpty } from "lodash";
import "./OrderStep.scss";

export const ORDER_STEP_VARIANTS = {
  DEFAULT: "DEFAULT",
  PROCESSING: "PROCESSING",
  SUCCESSFUL: "SUCCESSFUL",
};

const VARIANT_COLOR_MAPPER = {
  DEFAULT: color.supporting.gainsboro,
  PROCESSING: color.secondary.mango[400],
  SUCCESSFUL: color.secondary.profitGreen[400],
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
          backgroundColor: VARIANT_COLOR_MAPPER[variant],
        }}
      >
        <Typography variant="body1" className="aos-step-content">
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
            color={color.content.secondary}
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
