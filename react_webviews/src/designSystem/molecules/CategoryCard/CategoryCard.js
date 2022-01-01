import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '@mui/material/Typography';
import './CategoryCard.scss';

const CategoryCard = ({
  variant = 'small',
  ImgSrc,
  imgProps={},
  title,
  titleProps = {},
  subtitle,
  subtitleProps = {},
}) => {
  const variantData = variant === 'large' ? largeCardVariant : smallCardVariant;

  return (
    <div className='cc-wrapper'>
      <Imgc src={ImgSrc} style={variantData.imgStyle} {...imgProps}/>
      <Typography
        variant={variantData.titleVariant}
        className={variantData.titleClass}
        {...titleProps}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant={variantData.subtitleVariant}
          color={variantData.subtitleColor}
          className={variantData.subtitleClass}
          {...subtitleProps}
        >
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

export default CategoryCard;

const smallVariantImageStyle = {
  width: '52px',
  height: '52px',
  marginBottom: '4px',
  paddingLeft: '25.5px',
  paddingRight: '25.5px',
};

const largeVariantImageStyle = {
  width: '88px',
  height: '88px',
  marginBottom: '8px',
  paddingLeft: '35.5px',
  paddingRight: '35.5px',
};

const largeCardVariant = {
  titleVariant: 'heading4',
  subtitleVariant: 'body2',
  subtitleColor: 'foundationColors.content.secondary',
  imgStyle: largeVariantImageStyle,
  titleClass: 'cc-lg-title',
  subtitleClass: 'cc-lg-subtitle',
};

const smallCardVariant = {
  titleVariant: 'body2',
  subtitleVariant: 'body2',
  subtitleColor: 'foundationColors.content.secondary',
  imgStyle: smallVariantImageStyle,
  titleClass: 'cc-sm-title',
  subtitleClass: 'cc-sm-subtitle',
};
