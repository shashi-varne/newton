/*
  Props description:
  title(string),
  subtitle(string),
  variant: it should be one of 'small', 'large'.
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/


import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import './CategoryCard.scss';

const CategoryCard = ({
  variant,
  imgSrc,
  imgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onCardClick,
  dataAid
}) => {
  const largeVariant = variant === 'large';
  const variantData = largeVariant ? LARGE_CARD_VARIANT : SMALL_CARD_VARIANT;

  return (
    <div className={`cc-wrapper ${largeVariant && 'cc-wrapper-large-variant'}`} onClick={onCardClick} data-aid={`categoryCard_${dataAid}`}>
      <Imgc src={imgSrc} style={variantData.imgStyle} {...imgProps} dataAid='top'/>
      <Typography
        variant={variantData.titleVariant}
        className={variantData.titleClass}
        align='center'
        color={titleColor}
        data-aid='tv_title'
        component='div'
      >
        {title}
      </Typography>
      <Typography
        variant={variantData.subtitleVariant}
        color={subtitleColor ? subtitleColor : variantData.subtitleColor}
        className={variantData.subtitleClass}
        align='center'
        data-aid='tv_subtitle'
        component='div'
      >
        {subtitle}
      </Typography>
    </div>
  );
};

export default CategoryCard;

CategoryCard.defaultProps = {
  variant: 'small',
  imgProps: {},
};

CategoryCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  variant: PropTypes.oneOf(['small', 'large']),
  onCardClick: PropTypes.func,
  dataAid: PropTypes.string
};

const SMALL_VARIANT_IMAGE_STYLE = {
  width: '52px',
  height: '52px',
  marginBottom: '4px',
};

const LARGE_VARIANT_IMAGE_STYLE = {
  width: '88px',
  height: '88px',
  marginBottom: '8px',
};

const LARGE_CARD_VARIANT = {
  titleVariant: 'heading4',
  subtitleVariant: 'body2',
  subtitleColor: 'foundationColors.content.secondary',
  imgStyle: LARGE_VARIANT_IMAGE_STYLE,
  titleClass: 'cc-lg-title',
  subtitleClass: 'cc-lg-subtitle',
};

const SMALL_CARD_VARIANT = {
  titleVariant: 'body2',
  subtitleVariant: 'body2',
  subtitleColor: 'foundationColors.content.secondary',
  imgStyle: SMALL_VARIANT_IMAGE_STYLE,
  titleClass: 'cc-sm-title',
  subtitleClass: 'cc-sm-subtitle',
};
