import { Box } from "@mui/material";
import Checkbox from "designSystem/atoms/Checkbox";
import Separator from "designSystem/atoms/Separator";
import React from "react";
import Typography from "designSystem/atoms/Typography";
import Tag from "designSystem/molecules/Tag/Tag";
import "./PfFundSelectionCard.scss";
import PropTypes from "prop-types";
import { noop } from "lodash-es";
import CardItem from "./subComponents/CardItem";
import RowContainer from "./subComponents/RowContainer";

function PfFundSelectionCard({
  checked,
  textProps,
  leftImgSrc,
  rightImgSrc,
  middleImgSrc,
  bottomImgSrc,
  onClick,
  textColors,
}) {
  const {
    topTitle,
    topLabel,
    leftTitle,
    leftSubtitle,
    middleTitle,
    middleSubtitle,
    rightTitle,
    rightSubtitle,
    bottomTitle,
    bottomSubtitle,
    bottomLabel,
    dataAidSuffix,
  } = textProps;
  return (
    <Box
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
      className="pf-selection-container"
      onClick={onClick}
      data-aid={`pfFundSelectionCard_${dataAidSuffix}`}
    >
      <RowContainer className="top-row" alignItems="flex-start">
        <RowContainer justifyContent="flex-start">
          <Checkbox checked={checked} dataAid="1" className="checkbox" />
          <Typography
            variant="body1"
            color={textColors?.topTitle || "foundationColors.content.primary"}
            dataAid="title"
            className="main-title"
          >
            {topTitle}
          </Typography>
        </RowContainer>
        <Typography
          variant="body1"
          color={textColors.topLabel || "foundationColors.content.primary"}
          dataAid="label"
          className="top-label"
        >
          {topLabel}
        </Typography>
      </RowContainer>

      <Separator dataAid={"1"} />
      <RowContainer className="middle-row">
        <CardItem
          align="left"
          title={leftTitle}
          subtitle={leftSubtitle}
          img={leftImgSrc}
          id={1}
          titleColor={textColors?.leftTitle}
          subtitleColor={textColors?.leftSubtitle}
        />
        <CardItem
          align="center"
          title={middleTitle}
          subtitle={middleSubtitle}
          img={middleImgSrc}
          id={2}
          titleColor={textColors?.middleTitle}
          subtitleColor={textColors?.middleSubtitle}
        />
        <CardItem
          align="right"
          title={rightTitle}
          subtitle={rightSubtitle}
          img={rightImgSrc}
          id={3}
          titleColor={textColors?.rightTitle}
          subtitleColor={textColors?.rightSubtitle}
        />
      </RowContainer>
      <Separator dataAid={"1"} />
      <RowContainer className="bottom-row">
        <Typography
          variant="body5"
          color={
            textColors?.bottomTitle || "foundationColors.content.secondary"
          }
          dataAid="info"
        >
          {bottomTitle}
        </Typography>
        <Tag dataAid="label" label={bottomLabel} />
        <CardItem
          hideTitle
          align="right"
          subtitle={bottomSubtitle}
          img={bottomImgSrc}
          id={4}
          subtitleColor={textColors?.bottomSubtitle}
        />
      </RowContainer>
    </Box>
  );
}

PfFundSelectionCard.defaultProps = {
  checked: false,
  textProps: PropTypes.object,
  textColors: PropTypes.object,
  leftImgSrc: PropTypes.node,
  rightImgSrc: PropTypes.node,
  middleImgSrc: PropTypes.node,
  bottomImgSrc: PropTypes.node,
  onClick: noop,
  dataAidSuffix: "",
};

PfFundSelectionCard.propTypes = {
  checked: PropTypes.bool,
  textProps: PropTypes.object,
  textColors: PropTypes.object,
  leftImgSrc: PropTypes.string,
  rightImgSrc: PropTypes.string,
  middleImgSrc: PropTypes.string,
  bottomImgSrc: PropTypes.string,
  onClick: PropTypes.func,
  dataAidSuffix: PropTypes.string.isRequired,
};

export default PfFundSelectionCard;
