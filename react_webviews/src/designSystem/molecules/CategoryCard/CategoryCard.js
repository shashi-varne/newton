/*
  Props description:
  title,subtitle => can accept string/node
  variant: There are two variants as 'small', 'large'.
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from "react";
import PropTypes from "prop-types";
import Typography from "../../atoms/Typography";
import Stack from "@mui/material/Stack";
import Icon from "../../atoms/Icon";

import "./CategoryCard.scss";

const CATEGORY_CARD_VARIANT_88 = {
  titleVariant: "heading4",
  size: "88px",
};

const CATEGORY_CARD_VARIANT_55 = {
  size: "52px",
  titleVariant: "body2",
};

const CATEGORY_CARD_VARIANT_32 = {
  size: "32px",
  titleVariant: "body2",
};

const variantMapper = {
  variant88: CATEGORY_CARD_VARIANT_88,
  variant52: CATEGORY_CARD_VARIANT_55,
  variant32: CATEGORY_CARD_VARIANT_32,
};

const CategoryCard = ({
  variant,
  imgSrc,
  imgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onClick,
  dataAid,
}) => {
  const isVariant88 = variant === "variant88";
  const variantData = variantMapper[variant || "variant52"];
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      className={`cc-wrapper ${isVariant88 && "cc-wrapper-large-variant"}`}
      onClick={onClick}
      data-aid={`categoryCard_${dataAid}`}
    >
      <Icon src={imgSrc} size={"32px"} dataAid="top" {...imgProps} />
      {title && (
        <Typography
          variant={variantData.titleVariant}
          align="center"
          color={titleColor}
          dataAid="title"
          component="div"
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          variant="body2"
          color={subtitleColor ? subtitleColor : variantData.subtitleColor}
          align="center"
          dataAid="subtitle"
          component="div"
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

export default CategoryCard;

CategoryCard.defaultProps = {
  variant: "variant52",
  imgProps: {},
  subtitleColor: "foundationColors.content.secondary",
};

CategoryCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  variant: PropTypes.oneOf(["variant88", "variant52", "variant32"]),
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
};
