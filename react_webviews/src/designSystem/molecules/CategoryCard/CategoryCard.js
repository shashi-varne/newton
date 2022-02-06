/*
  Props description:
  title,subtitle => can accept string/node
  variant: There are two variants as 'small', 'large'.
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Stack from '@mui/material/Stack';
import Icon from '../../atoms/Icon';

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
    <Stack
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      className={`cc-wrapper ${largeVariant && 'cc-wrapper-large-variant'}`}
      onClick={onClick}
      data-aid={`categoryCard_${dataAid}`}
    >
      <Icon src={imgSrc} size={variantData.size} dataAid='top' {...imgProps} />
      {title && (
        <Typography
          variant={variantData.titleVariant}
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
          variant='body2'
          color={subtitleColor ? subtitleColor : variantData.subtitleColor}
          align='center'
          dataAid='subtitle'
          component='div'
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

export default CategoryCard;

CategoryCard.defaultProps = {
  variant: 'small',
  imgProps: {},
  subtitleColor: 'foundationColors.content.secondary',
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

const LARGE_CARD_VARIANT = {
  titleVariant: 'heading4',
  size: '88px',
};

const SMALL_CARD_VARIANT = {
  size: '52px',
  titleVariant: 'body2',
};
