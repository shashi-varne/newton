/*
  Below are props description
  imgSrc : source path of the image.
  imgProps(object): other props used for image.
  title(string): Title using variant heading4.
  subtitle(string): subtitle using variant body2.
  titleColor,subtitleColor : it is strongly recommended to only use foundation colors for these props.
  Example: 
  titleColor: foundationColors.secondary.mango.300
*/

import React from "react";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import Typography from "../../atoms/Typography";
import PropTypes from "prop-types";
import "./InfoCard.scss";
import Icon from "../../atoms/Icon";

const InfoCard = ({
  imgSrc,
  imgProps = {},
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onClick,
  dataAid,
  rightImgSrc,
  rightImgProps = {},
  rightLabel,
  rightLabelColor,
  label,
  labelColor,
}) => {
  return (
    <Box
      sx={infoCardWrapperSxStyle}
      className="info-card-wrapper"
      onClick={onClick}
      data-aid={`infoCard_${dataAid}`}
    >
      {imgSrc && (
        <Icon
          size="32px"
          src={imgSrc}
          className="info-card-left-img"
          dataAid="left"
          {...imgProps}
        />
      )}
      <div className="ic-content">
        <div className="ic-text-wrapper">
          <Typography
            variant="heading4"
            color={titleColor}
            component="div"
            dataAid="title"
          >
            {title}
          </Typography>
          <Typography
            className="ic-subtitle-text"
            variant="body2"
            color={subtitleColor}
            component="div"
            dataAid="subtitle"
          >
            {subtitle}
          </Typography>
        </div>
        <div className="ic-label-wrapper">
          {label && (
            <Typography
              variant="body2"
              component="div"
              color={labelColor}
              dataAid="label"
            >
              {label}
            </Typography>
          )}
          {rightImgSrc && (
            <Icon
              size="24px"
              src={rightImgSrc}
              className="ic-right-img"
              dataAid="right"
              {...rightImgProps}
            />
          )}
        </div>
      </div>
      <Stack
        direction="row"
        sx={{ flexGrow: 1, paddingLeft: "8px", gap: "6px" }}
        justifyContent="flex-end"
        alignItems="center"
      >
        {rightLabel && (
          <Typography variant="body2" color={rightLabelColor}>
            {rightLabel}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default InfoCard;

const infoCardWrapperSxStyle = {
  backgroundColor: "foundationColors.supporting.white",
};

InfoCard.defaultProps = {
  subtitleColor: "foundationColors.content.secondary",
  rightLabelColor: "foundationColors.content.secondary",
  labelColor: "foundationColors.content.secondary",
};

InfoCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  onClick: PropTypes.func,
  imgProps: PropTypes.object,
};
