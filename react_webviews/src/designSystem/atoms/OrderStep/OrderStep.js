import React from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import Typography from "../Typography";
import { isEmpty, noop } from "lodash";
import Separator from "../Separator";
import Button from "../Button/Button";
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
    titleColor,
    subtitle = "",
    subtitleColor,
    stepCount = "",
    stepCountColor,
    label = "",
    labelColor,
    dataAid,
    children,
    variant = ORDER_STEP_VARIANTS.DEFAULT,
    showStepLine,
    buttonTitle = "",
    onClickButton = noop,
  } = props;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing="12px"
      className={`atom-order-step ${className}`}
      data-aid={`orderStep_${dataAid}`}
    >
      <div className="aos-grp">
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
            color={stepCountColor}
            dataAid="number"
          >
            {stepCount}
          </Typography>
        </Box>
        {showStepLine && (
          <Separator
            orientation="vertical"
            className="aos-line"
            dataAid="1"
            style={{
              backgroundColor: "foundationColors.supporting.athensGrey",
            }}
          />
        )}
      </div>
      <Stack spacing="8px" direction="row" sx={{ display: "flex", flex: 1 }}>
        <Stack
          sx={{ display: "flex", flex: 1 }}
          direction="column"
          spacing="4px"
        >
          {!isEmpty(title) && (
            <Typography
              variant="body1"
              color={titleColor}
              className="aos-title"
              dataAid="title"
            >
              {title}
            </Typography>
          )}
          {!isEmpty(subtitle) && (
            <Typography
              variant="body2"
              className="aos-subtitle"
              color={subtitleColor}
              dataAid="subtitle"
              component="div"
            >
              {subtitle}
            </Typography>
          )}
          {children}
          {!isEmpty(buttonTitle) && (
            <Button
              size={"small"}
              variant={"link"}
              title={buttonTitle}
              onClick={onClickButton}
            />
          )}
        </Stack>
        {!isEmpty(label) && (
          <Typography variant="body2" dataAid="label" color={labelColor}>
            {label}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default OrderStep;

OrderStep.defaultProps = {
  stepCountColor: "foundationColors.supporting.white",
  subtitleColor: "foundationColors.content.secondary",
  labelColor: "foundationColors.content.secondary",
};

OrderStep.propTypes = {
  variant: PropTypes.oneOf(Object.values(ORDER_STEP_VARIANTS)),
  dataAid: PropTypes.string,
  className: PropTypes.string,
  stepCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showStepLine: PropTypes.bool,
  onClickButton: PropTypes.func,
};
