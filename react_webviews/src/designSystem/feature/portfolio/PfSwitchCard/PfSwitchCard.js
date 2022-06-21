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
  variant,
  onClick,
  label,
  labelOne,
  topTitle,
  topImgSrc,
  topDesc,
  labelTwo,
  bottomTitle,
  bottomImgSrc,
  bottomDesc,
  switchImgSrc,
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
              dataAid="top"
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
      </Box>
      {variant === PF_SWITCH_TYPE.DETAIL ? (
        <>
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid="label"
            className="label"
          >
            {label}
          </Typography>
          <FeatureDetail {...props} />
          <Separator dataAid={1} />
          <FeatureBottomRow {...props} />
        </>
      ) : (
        <>
          <ProgressItem
            label={labelOne}
            title={topTitle}
            imgSrc={topImgSrc}
            desc={topDesc}
            id={1}
          />
          <Box className="middle-img-container">
            <Icon
              src={switchImgSrc}
              width="40px"
              height="40px"
              className="img-center"
              dataAid="center"
            />
          </Box>
          <Separator dataAid={1} />
          <ProgressItem
            label={labelTwo}
            title={bottomTitle}
            imgSrc={bottomImgSrc}
            desc={bottomDesc}
            id={2}
          />
        </>
      )}
    </Box>
  );
}

const ProgressItem = ({ label, imgSrc, title, desc, id }) => {
  return (
    <Box className={`progress-item ${id === 1 && "progress-item-one"} `}>
      <Typography
        variant="body5"
        color="foundationColors.content.secondary"
        dataAid={`label${id}`}
        className="progress-label"
      >
        {label}
      </Typography>
      <RowContainer
        className="progress-row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <RowContainer justifyContent="flex-start" alignItems="flex-start">
          <Icon
            src={imgSrc}
            width="32px"
            height="32px"
            className="progress-icon"
            dataAid={`left${id}`}
          />
          <Typography
            variant="body2"
            color="foundationColors.content.primary"
            dataAid={`title${id}`}
            style={{ marginRight: 5 }}
            className="title"
          >
            {title}
          </Typography>
        </RowContainer>
        <Typography
          variant="body1"
          color="foundationColors.content.primary"
          dataAid={`value${id}`}
        >
          {desc}
        </Typography>
      </RowContainer>
    </Box>
  );
};

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
