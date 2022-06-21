import { Box, Stack } from "@mui/material";
import React from "react";
import Icon from "../../../atoms/Icon";
import Typography from "../../../atoms/Typography";
import "./PfFundDetail.scss";
import Separator from "designSystem/atoms/Separator";
import Tag from "../../../molecules/Tag/Tag";

export const PF_DETAIL_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
};

function PfFundDetail({ variant, onClick, ...props }) {
  return (
    <Box
      onClick={onClick}
      className="pf-fund-detail-container"
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
    >
      <TopSection {...props} />
      <Separator dataAid={1} />
      {variant === PF_DETAIL_VARIANT.PRIMARY ? (
        <PrimaryBottomSection {...props} />
      ) : (
        <SecondaryBottomSection {...props} />
      )}
    </Box>
  );
}

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

const PrimaryBottomSection = ({
  bottomTitle,
  bottomLabel,
  bottomSubtitle,
  bottomImgSrc,
}) => {
  return (
    <Box className="bottom-section">
      <RowContainer>
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid="info"
        >
          {bottomTitle}
        </Typography>
        <Tag label={bottomLabel} dataAid="label" />
        <RowContainer justifyContent="flex-start">
          <Icon
            src={bottomImgSrc}
            width="16px"
            height="16px"
            dataAid="left4"
            style={{ marginRight: 4 }}
          />
          <Typography
            variant="body5"
            color="foundationColors.content.secondary"
            dataAid="subtitle2"
          >
            {bottomSubtitle}
          </Typography>
        </RowContainer>
      </RowContainer>
    </Box>
  );
};

const SecondaryBottomSection = ({ bottomRowData }) => {
  const {
    leftTitle,
    leftSubtitle,
    leftImgSrc,
    middleTitle,
    middleImgSrc,
    middleSubtitle,
    rightTitle,
    rightImgSrc,
    rightSubtitle,
  } = bottomRowData;

  return (
    <RowContainer className="bottom-section-two">
      <CustomItem
        title={leftTitle}
        subtitle={leftSubtitle}
        id={1}
        imgSrc={leftImgSrc}
        align="left"
      />
      <CustomItem
        title={middleTitle}
        subtitle={middleSubtitle}
        id={2}
        imgSrc={middleImgSrc}
        align="center"
      />
      <CustomItem
        title={rightTitle}
        subtitle={rightSubtitle}
        id={3}
        imgSrc={rightImgSrc}
        align="right"
      />
    </RowContainer>
  );
};

const CustomItem = ({ title, subtitle, id, imgSrc, align }) => {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="body5"
        color="foundationColors.content.secondary"
        dataAid={`key${id}`}
      >
        {title}
      </Typography>
      <RowContainer justifyContent="flex-start">
        <Icon
          src={imgSrc}
          width="16px"
          height="16px"
          dataAid={`left${id}`}
          style={{ marginRight: 4 }}
        />
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid={`value${id}`}
        >
          {subtitle}
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
      justifyContent="space-between"
      {...props}
    >
      {children}
    </Stack>
  );
};

export default PfFundDetail;
