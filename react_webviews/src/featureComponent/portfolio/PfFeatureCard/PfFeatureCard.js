import { Box, Stack } from "@mui/material";
import React from "react";
import Typography from "designSystem/atoms/Typography";
import Separator from "designSystem/atoms/Separator";
import Icon from "designSystem/atoms/Icon";
import "./PfFeatureCard.scss";
import PropTypes from "prop-types";
import Tooltip, {
  TOOLTIP_PLACEMENTS,
} from "../../../designSystem/atoms/Tooltip";
import { noop } from "lodash-es";

function PfFeatureCard({
  topImgSrc,
  textProps,
  leftIcon,
  middleIcon,
  rightIcon,
  textColors,
  dataAid,
  toolTipProps,
}) {
  const {
    title,
    leftTitle,
    leftSubtitle,
    rightTitle,
    rightSubtitle,
    middleTitle,
    middleSubtitle,
  } = textProps;
  return (
    <Box
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
      className="pf-feature-card-container"
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
          color={textColors?.title || "foundationColors.content.primary"}
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
          src={leftIcon}
          title={leftTitle}
          subtitle={leftSubtitle}
          alignment="flex-start"
          id={1}
          iconId={"left"}
          titleColor={textColors?.leftTitle}
          subTitleColor={textColors?.leftSubtitle}
          tooltipText={toolTipProps?.leftText}
        />
        <FeatureItem
          src={middleIcon}
          title={middleTitle}
          subtitle={middleSubtitle}
          alignment="center"
          id={2}
          iconId={"center"}
          titleColor={textColors?.middleTitle}
          subTitleColor={textColors?.middleSubtitle}
          tooltipText={toolTipProps?.middleText}
        />
        <FeatureItem
          src={rightIcon}
          title={rightTitle}
          subtitle={rightSubtitle}
          alignment="flex-end"
          iconId={"right"}
          id={3}
          titleColor={textColors?.rightTitle}
          subTitleColor={textColors?.rightSubtitle}
          tooltipText={toolTipProps?.rightText}
        />
      </Stack>
    </Box>
  );
}

const FeatureItem = ({
  src,
  title,
  subtitle,
  alignment,
  id,
  iconId,
  titleColor,
  subTitleColor,
  tooltipText,
}) => {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent={alignment}>
        <Typography
          variant="body5"
          color={titleColor || "foundationColors.content.secondary"}
          dataAid={`key${id}`}
        >
          {title}
        </Typography>
        {!!tooltipText && (
          <Tooltip
            dataAid="exitLoad"
            title={tooltipText}
            placement={TOOLTIP_PLACEMENTS.TOP}
          >
            <div>
              <Icon
                src={src}
                width="16px"
                height="16px"
                style={{ marginLeft: 4 }}
                className="info-icon"
                dataAid={iconId}
              />
            </div>
          </Tooltip>
        )}
      </Stack>
      <Typography
        variant="body2"
        color={subTitleColor || "foundationColors.content.primary"}
        dataAid={`value${id}`}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

PfFeatureCard.defaultProps = {
  textProps: {},
  toolTipProps: {},
  textColors: {},
  onClick: noop,
  dataAid: "",
};

PfFeatureCard.propTypes = {
  textProps: PropTypes.shape({
    title: PropTypes.string,
    leftTitle: PropTypes.string,
    leftSubtitle: PropTypes.string,
    rightTitle: PropTypes.string,
    rightSubtitle: PropTypes.string,
    middleTitle: PropTypes.string,
    middleSubtitle: PropTypes.string,
  }),
  toolTipProps: PropTypes.shape({
    leftText: PropTypes.string,
    middleText: PropTypes.string,
    rightText: PropTypes.string,
  }),
  textColors: PropTypes.shape({
    title: PropTypes.string,
    leftTitle: PropTypes.string,
    leftSubtitle: PropTypes.string,
    rightTitle: PropTypes.string,
    rightSubtitle: PropTypes.string,
    middleTitle: PropTypes.string,
    middleSubtitle: PropTypes.string,
  }),
  onClick: PropTypes.func,
  dataAid: PropTypes.string.isRequired,
};

export default PfFeatureCard;
