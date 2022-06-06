import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import Separator from "designSystem/atoms/Separator";
import React from "react";
import Icon from "../../../atoms/Icon";
import Typography from "../../../atoms/Typography";
import { FeatureBottomRow, FeatureDetail } from "./FeatureDetail";
import "./PfSwitchCard.scss";

export const PF_SWITCH_TYPE = {
  DETAIL: "detail",
  PROGRESS: "progress",
};

function PfSwitchCard({
  infoText,
  topLeftImgSrc,
  status,
  label,
  variant,
  onClick,
  ...props
}) {
  return (
    <Box
      sx={{ backgroundColor: "foundationColors.supporting.white" }}
      className="switch-container"
      onClick={onClick}
    >
      <Box className="top-section">
        <RowContainer className="top-row" justifyContent="space-between">
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid="info"
          >
            {infoText}
          </Typography>
          <RowContainer>
            <Icon
              src={topLeftImgSrc}
              dataAid={"top"}
              width="16px"
              height="16px"
            />
            <Typography
              allCaps
              color="foundationColors.content.secondary"
              dataAid="status"
              className="status"
            >
              {status}
            </Typography>
          </RowContainer>
        </RowContainer>
        <RowContainer>
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid="label"
            className="label"
          >
            {label}
          </Typography>
        </RowContainer>
      </Box>
      {variant === PF_SWITCH_TYPE.DETAIL ? (
        <>
          <FeatureDetail {...props} />
          <Separator dataAid={1} />
          <FeatureBottomRow {...props} />
        </>
      ) : (
        <FeatureProgress {...props} />
      )}
    </Box>
  );
}

export const RowContainer = ({ children, ...props }) => {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      {...props}
    >
      {children}
    </Stack>
  );
};

export default PfSwitchCard;
