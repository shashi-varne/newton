/*
  Props description:
  title,subtitle => can accept string/node
  variant: There are two variants as 'small', 'large'.
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import './CategoryCard.scss';

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
  const largeVariant = variant === 'large';
  const variantData = largeVariant ? LARGE_CARD_VARIANT : SMALL_CARD_VARIANT;

  return (
    <div
      className={`cc-wrapper ${largeVariant && 'cc-wrapper-large-variant'}`}
      onClick={onClick}
      data-aid={`categoryCard_${dataAid}`}
    >
      <Imgc src={imgSrc} style={variantData.imgStyle} dataAid='top' {...imgProps} />
      {title && (
        <Typography
          variant={variantData.titleVariant}
          className={variantData.titleClass}
          align='center'
          color={titleColor}
          dataAid='title'
          component='div'
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          variant={variantData.subtitleVariant}
          color={subtitleColor ? subtitleColor : variantData.subtitleColor}
          className={variantData.subtitleClass}
          align='center'
          dataAid='subtitle'
          component='div'
        >
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

export default CategoryCard;

CategoryCard.defaultProps = {
  variant: 'small',
  imgProps: {},
};

CategoryCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  variant: PropTypes.oneOf(['small', 'large']),
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
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
