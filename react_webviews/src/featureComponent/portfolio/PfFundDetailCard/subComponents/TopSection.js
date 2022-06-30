import { Box } from "@mui/material";
import React from "react";
import Icon from "designSystem/atoms/Icon";
import Typography from "designSystem/atoms/Typography";
import RowContainer from "./RowContainer";

const TopSection = ({
  label,
  topImgSrc,
  topTitle,
  middleImgSrc,
  mainTitle,
  middleLabel,
  colorProps,
}) => {
  return (
    <Box className="top-section">
      <RowContainer className="row-one">
        <Typography
          variant="body5"
          color={colorProps?.label || "foundationColors.content.secondary"}
          dataAid="label1"
          className="label"
        >
          {label}
        </Typography>
        <RowContainer justifyContent="flex-start">
          <Icon
            src={topImgSrc}
            width="16px"
            height="16px"
            dataAid="top"
            style={{ marginRight: 4 }}
          />
          <Typography
            allCaps
            color={colorProps?.topTitle || "foundationColors.content.secondary"}
            dataAid="label2"
          >
            {topTitle}
          </Typography>
        </RowContainer>
      </RowContainer>
      <RowContainer className="row-two">
        <RowContainer justifyContent="flex-start">
          <Icon
            src={middleImgSrc}
            width="32px"
            height="32px"
            dataAid="left"
            style={{ marginRight: 16 }}
          />
          <Typography
            variant="body2"
            color={
              colorProps?.mainTitle || "foundationColors.content.secondary"
            }
            dataAid="title"
          >
            {mainTitle}
          </Typography>
        </RowContainer>
        <Typography
          variant="body1"
          color={colorProps?.middleLabel || "foundationColors.content.primary"}
          dataAid="subtitle1"
        >
          {middleLabel}
        </Typography>
      </RowContainer>
    </Box>
  );
};
export default TopSection;
