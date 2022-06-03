import { Box, Stack } from "@mui/material";
import React from "react";
import Icon from "designSystem/atoms/Icon";
import Typography from "../../../atoms/Typography";
import "./PfProgressCard.scss";
import Separator from "designSystem/atoms/Separator";
import ProgressBar from "designSystem/atoms/ProgressBar";
import Button from "designSystem/atoms/Button";
import Tag from "../../../molecules/Tag/Tag";

function PfProgressCard({
  topImgSrc,
  title,
  subtitle,
  leftTitle,
  leftSubtitle,
  rightTitle,
  rightSubtitle,
  label,
  bottomImgSrc,
  textLabel,
  buttonText,
  onClick,
  dataAid,
}) {
  return (
    <Box
      data-aid={`pfProgressCard_${dataAid}`}
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
      className="container"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        className="top-row"
      >
        <Icon
          src={topImgSrc}
          className="left-img"
          width="32px"
          height="32px"
          dataAid="left"
        />
        <Stack direction="column">
          <Typography
            variant="body1"
            color="foundationColors.content.primary"
            dataAid="title"
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid="subtitle1"
          >
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
      <Separator dataAid={"1"} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className="middle-row"
      >
        <Box>
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid="key1"
          >
            {leftTitle}
          </Typography>
          <Typography
            variant="body2"
            color="foundationColors.content.primary"
            dataAid="value1"
          >
            {leftSubtitle}
          </Typography>
        </Box>
        <Box className="right-align">
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid="key2"
          >
            {rightTitle}
          </Typography>
          <Typography
            variant="body2"
            color="foundationColors.content.primary"
            dataAid="value2"
          >
            {rightSubtitle}
          </Typography>
        </Box>
      </Stack>
      <Box className="progress-bar-container">
        <ProgressBar dataAidSuffix={"1"} percentage={30} />
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className="bottom-row"
      >
        <Tag dataAid={"1"} label={label} />
        <Stack direction="row" align-items="center">
          <Icon
            src={bottomImgSrc}
            width="16px"
            height="16px"
            style={{ marginRight: 8 }}
            dataAid="center"
          />
          <Typography
            variant="body2"
            color="foundationColors.content.secondary"
            dataAid="subtitle2"
          >
            {textLabel}
          </Typography>
        </Stack>
        <Button
          backgroundColor="foundationColors.primary"
          size="small"
          title={buttonText}
          variant="primary"
          onClick={onClick}
        />
      </Stack>
    </Box>
  );
}

export default PfProgressCard;
