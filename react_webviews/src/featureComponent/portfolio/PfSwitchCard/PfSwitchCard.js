import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import Separator from "designSystem/atoms/Separator";
import React from "react";
import Icon from "designSystem/atoms/Icon";
import Typography from "designSystem/atoms/Typography";
import { FeatureBottomRow, FeatureDetail } from "./subComponents/FeatureDetail";
import "./PfSwitchCard.scss";
import PropTypes from "prop-types";
import { noop } from "lodash-es";

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
  textColors,
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
            color={textColors?.infoText || "foundationColors.content.secondary"}
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
              dataAid={textColors?.status || "status"}
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
            color={textColors?.label || "foundationColors.content.secondary"}
            dataAid="label"
            className="label"
          >
            {label}
          </Typography>
          <FeatureDetail textColors={textColors} {...props} />
          <Separator dataAid={1} />
          <FeatureBottomRow textColors={textColors} {...props} />
        </>
      ) : (
        <>
          <ProgressItem
            label={labelOne}
            title={topTitle}
            imgSrc={topImgSrc}
            desc={topDesc}
            id={1}
            textColors={textColors}
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
PfSwitchCard.defaultProps = {
  infoText: "",
  status: "",
  variant: PF_SWITCH_TYPE.DETAIL,
  onClick: noop,
  label: "",
  labelOne: "",
  topTitle: "",
  topDesc: "",
  labelTwo: "",
  bottomTitle: "",
  bottomDesc: "",
};

PfSwitchCard.PropTypes = {
  infoText: PropTypes.string,
  topLeftImgSrc: PropTypes.node,
  status: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  labelOne: PropTypes.labelOne,
  topTitle: PropTypes.string,
  topImgSrc: PropTypes.node,
  topDesc: PropTypes.topDesc,
  labelTwo: PropTypes.string,
  bottomTitle: PropTypes.string,
  bottomImgSrc: PropTypes.node,
  bottomDesc: PropTypes.string,
  switchImgSrc: PropTypes.node,
  textColors: PropTypes.shape({
    infoText: PropTypes.string,
    status: PropTypes.string,
    label: PropTypes.string,
    tags: PropTypes.string,
    description: PropTypes.string,
    middleLabel: PropTypes.string,
    title: PropTypes.string,
    leftTitle: PropTypes.string,
    leftSubtitle: PropTypes.string,
    centerTitle: PropTypes.string,
    centerSubtitle: PropTypes.string,
    rightTitle: PropTypes.string,
    rightSubtitle: PropTypes.string,
  }),
};

export default PfSwitchCard;
