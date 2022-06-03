import { Box, Stack } from "@mui/material";
import React from "react";
import Typography from "designSystem/atoms/Typography";
import Separator from "designSystem/atoms/Separator";
import Icon from "designSystem/atoms/Icon";
import "./PfFeatureCard.scss";

function PfFeatureCard({
  title,
  topImgSrc,
  leftTitle,
  leftSubtitle,
  rightTitle,
  rightSubtitle,
  middleTitle,
  middleSubtitle,
  leftIcon,
  middleIcon,
  rightIcon,
  onClick,
  onIconClick,
  dataAid,
}) {
  return (
    <Box
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
      className="container"
      onClick={onClick}
      data-aid={`pfFeatureCardSmall_${dataAid}`}
    >
      <Stack
        className="top-row"
        direction="row"
        alignItems="center"
        justifyContent={topImgSrc ? "flex-start" : "center"}
      >
        {topImgSrc && (
          <Icon
            src={topImgSrc}
            width="32px"
            height="32px"
            style={{ marginRight: 16 }}
            dataAid="left"
          />
        )}
        <Typography
          variant="body1"
          color="foundationColors.content.primary"
          dataAid="title"
        >
          {title}
        </Typography>
      </Stack>
      <Separator dataAid={"1"} />
      <Stack
        className="bottom-row"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <FeatureItem
          onclick={onIconClick}
          src={leftIcon}
          title={leftTitle}
          subtitle={leftSubtitle}
          alignment="flex-start"
          id={1}
          iconId={"left"}
        />
        <FeatureItem
          onclick={onIconClick}
          src={middleIcon}
          title={middleTitle}
          subtitle={middleSubtitle}
          alignment="center"
          id={2}
          iconId={"center"}
        />
        <FeatureItem
          onclick={onIconClick}
          src={rightIcon}
          title={rightTitle}
          subtitle={rightSubtitle}
          alignment="flex-end"
          iconId={"right"}
          id={3}
        />
      </Stack>
    </Box>
  );
}

const FeatureItem = ({
  src,
  title,
  subtitle,
  onClick,
  alignment,
  id,
  iconId,
}) => {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent={alignment}>
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid={`key${id}`}
        >
          {title}
        </Typography>
        <Icon
          src={src}
          width="16px"
          height="16px"
          style={{ marginLeft: 4 }}
          onClick={onClick}
          className="info-icon"
          dataAid={iconId}
        />
      </Stack>
      <Typography
        variant="body2"
        color="foundationColors.content.primary"
        dataAid={`value${id}`}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default PfFeatureCard;
