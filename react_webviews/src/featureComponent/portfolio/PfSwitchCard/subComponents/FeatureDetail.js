import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Icon from "designSystem/atoms/Icon";
import Typography from "designSystem/atoms/Typography";
import { RowContainer } from "../PfSwitchCard";
import "./../PfSwitchCard.scss";

export const FeatureDetail = ({
  title,
  tags,
  description,
  middleLabel,
  middleImgSrc,
  textColors,
}) => {
  return (
    <Box>
      <RowContainer
        className="detail-container"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <RowContainer alignItems="flex-start" className="middle-left">
          <Box style={{ marginRight: 8 }}>
            <Icon src={middleImgSrc} width="32px" height="32px" />
          </Box>
          <Stack flexDirection="column">
            <Typography
              variant="body1"
              color={textColors?.title || "foundationColors.content.primary"}
              dataAid="title"
            >
              {title}
            </Typography>
            <RowContainer className="tag-row">
              {tags.map((tag, index) => (
                <RowContainer alignItems="center" key={index}>
                  <Typography
                    key={index}
                    variant="body9"
                    color={
                      textColors?.tag || "foundationColors.content.tertiary"
                    }
                    dataAid={`tag_${index + 1}`}
                  >
                    {tag}
                  </Typography>
                  {tags.length - 1 !== index && (
                    <Box
                      sx={{
                        backgroundColor:
                          "foundationColors.supporting.cadetBlue",
                      }}
                      className="divider"
                    ></Box>
                  )}
                </RowContainer>
              ))}
            </RowContainer>
            <Typography
              variant="body2"
              color="foundationColors.content.tertiary"
              dataAid="subtitle"
            >
              {description}
            </Typography>
          </Stack>
        </RowContainer>
        <Typography
          variant="body1"
          color={textColors?.middleLabel || "foundationColors.content.primary"}
          dataAid="value"
          className="middle-right"
        >
          {middleLabel}
        </Typography>
      </RowContainer>
    </Box>
  );
};

export const FeatureBottomRow = ({
  leftImgSrc,
  centerImgSrc,
  rightImgSrc,
  leftTitle,
  leftSubtitle,
  centerSubtitle,
  centerTitle,
  rightTitle,
  rightSubtitle,
  textColors,
}) => {
  return (
    <RowContainer justifyContent="space-between" className="bottom-row">
      <CardItem
        align="left"
        title={leftTitle}
        subtitle={leftSubtitle}
        titleColor={textColors?.leftTitle}
        subtitleColor={textColors?.leftSubtitle}
        img={leftImgSrc}
        id={1}
      />
      <CardItem
        align="center"
        title={centerTitle}
        subtitle={centerSubtitle}
        titleColor={textColors?.centerTitle}
        subtitleColor={textColors?.centerSubtitle}
        img={centerImgSrc}
        id={2}
      />
      <CardItem
        align="right"
        title={rightTitle}
        subtitle={rightSubtitle}
        titleColor={textColors?.rightTitle}
        subtitleColor={textColors?.rightSubtitle}
        img={rightImgSrc}
        id={3}
      />
    </RowContainer>
  );
};

export const CardItem = ({
  img,
  title,
  subtitle,
  align,
  id,
  titleColor,
  subtitleColor,
}) => {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant="body5"
        color={titleColor || "foundationColors.content.secondary"}
        dataAid={`key${id}`}
      >
        {title}
      </Typography>

      <RowContainer>
        <Icon
          src={img}
          width="16px"
          height="16px"
          style={{ marginRight: 4 }}
          dataAid={`left${id}`}
        />
        <Typography
          variant="body2"
          dataAid={`value${id}`}
          color={subtitleColor || "foundationColors.content.primary"}
        >
          {subtitle}
        </Typography>
      </RowContainer>
    </Box>
  );
};
