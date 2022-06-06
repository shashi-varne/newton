import { Box, Stack } from "@mui/material";
import Checkbox from "designSystem/atoms/Checkbox";
import Separator from "designSystem/atoms/Separator";
import React from "react";
import Icon from "../../../atoms/Icon";
import Typography from "../../../atoms/Typography";
import Tag from "../../../molecules/Tag/Tag";
import "./PfFundSelectionCard.scss";
import PropTypes from "prop-types";
import { noop } from "lodash-es";

function PfFundSelectionCard({
  checked,
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
  leftImgSrc,
  rightImgSrc,
  middleImgSrc,
  bottomImgSrc,
  onClick,
}) {
  return (
    <Box
      sx={{
        backgroundColor: "foundationColors.supporting.white",
      }}
      className="container"
      onClick={onClick}
    >
      <RowContainer className="top-row" alignItems="flex-start">
        <RowContainer justifyContent="flex-start">
          <Checkbox checked={checked} className="checkbox" />
          <Typography
            variant="body1"
            color="foundationColors.content.primary"
            dataAid="title"
            className="main-title"
          >
            {topTitle}
          </Typography>
        </RowContainer>
        <Typography
          variant="body1"
          color="foundationColors.content.primary"
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
        />
        <CardItem
          align="center"
          title={middleTitle}
          subtitle={middleSubtitle}
          img={middleImgSrc}
          id={2}
        />
        <CardItem
          align="right"
          title={rightTitle}
          subtitle={rightSubtitle}
          img={rightImgSrc}
          id={3}
        />
      </RowContainer>
      <Separator dataAid={"1"} />
      <RowContainer className="bottom-row">
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
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
        />
      </RowContainer>
    </Box>
  );
}

const RowContainer = ({ children, ...props }) => {
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

const CardItem = ({ img, title, subtitle, align, hideTitle, id }) => {
  return (
    <Box sx={{ textAlign: align }}>
      {!hideTitle && (
        <Typography
          variant="body5"
          color="foundationColors.content.secondary"
          dataAid={`key${id}`}
        >
          {title}
        </Typography>
      )}

      <RowContainer>
        <Icon
          src={img}
          width="16px"
          height="16px"
          style={{ marginRight: 4 }}
          dataAid={`left${id}`}
        />
        <Typography
          variant={hideTitle ? "body5" : "body2"}
          dataAid={hideTitle ? "subtitle" : `value${id}`}
          color={
            hideTitle
              ? "foundationColors.content.secondary"
              : "foundationColors.content.primary"
          }
        >
          {subtitle}
        </Typography>
      </RowContainer>
    </Box>
  );
};

PfFundSelectionCard.defaultProps = {
  checked: false,
  topTitle: "",
  topLabel: "",
  leftTitle: "",
  leftSubtitle: "",
  middleTitle: "",
  middleSubtitle: "",
  rightTitle: "",
  rightSubtitle: "",
  bottomTitle: "",
  bottomSubtitle: "",
  bottomLabel: "",
  leftImgSrc: "",
  rightImgSrc: "",
  middleImgSrc: "",
  bottomImgSrc: "",
  onClick: noop,
};

PfFundSelectionCard.propTypes = {
  checked: PropTypes.bool,
  topTitle: PropTypes.string,
  topLabel: PropTypes.string,
  leftTitle: PropTypes.string,
  leftSubtitle: PropTypes.string,
  middleTitle: PropTypes.string,
  middleSubtitle: PropTypes.string,
  rightTitle: PropTypes.string,
  rightSubtitle: PropTypes.string,
  bottomTitle: PropTypes.string,
  bottomSubtitle: PropTypes.string,
  bottomLabel: PropTypes.string,
  leftImgSrc: PropTypes.string,
  rightImgSrc: PropTypes.string,
  middleImgSrc: PropTypes.string,
  bottomImgSrc: PropTypes.string,
  onClick: PropTypes.func,
};

export default PfFundSelectionCard;
