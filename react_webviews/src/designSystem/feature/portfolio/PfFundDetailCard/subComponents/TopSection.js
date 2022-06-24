import { Box } from "@mui/material";
import React from "react";
import Icon from "../../../../atoms/Icon";
import Typography from "../../../../atoms/Typography";
import RowContainer from "./RowContainer";

const TopSection = ({
  label,
  topImgSrc,
  topTitle,
  middleImgSrc,
  mainTitle,
  middleLabel,
}) => {
  return (
    <Box className="top-section">
      <RowContainer className="row-one">
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
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
            color="foundationColors.content.secondary"
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
            color="foundationColors.content.secondary"
            dataAid="title"
          >
            {mainTitle}
          </Typography>
        </RowContainer>
        <Typography
          variant="body1"
          color="foundationColors.content.primary"
          dataAid="subtitle1"
        >
          {middleLabel}
        </Typography>
      </RowContainer>
    </Box>
  );
};
export default TopSection;
