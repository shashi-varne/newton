/*
  prop types:
  title, subtitle, description => string/node
  titleColor, subtitleColor, descriptionColor: can accept foundation colors.
  Example: 
  NOTE: STRINGLY RECOMMENDED TO USE ONLY FOUNDATION COLORS.
  titleColor: 'foundationColors.secondary.mango.300'
  onClick(function): control the behaviour of the card when clicked.
*/

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Icon from '../../atoms/Icon';

import Stack from '@mui/material/Stack';

import './CardVertical.scss';

const CardVertical = ({
  imgSrc,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
  onClick,
  imgProps,
  className,
  dataAid,
  sx,
}) => {
  return (
    <Stack
      direction='column'
      spacing='4px'
      onClick={onClick}
      className={`cv-wrapper ${className}`}
      sx={sx}
      data-aid={`cardVertical_${dataAid}`}
    >
      {imgSrc && <Icon src={imgSrc} size='32px' dataAid='top' {...imgProps} />}
      {title && (
        <Typography
          variant='body1'
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
          color={subtitleColor}
          dataAid='subtitle'
          component='div'
        >
          {subtitle}
        </Typography>
      )}
      {description && (
        <Typography
          variant='body2'
          color={descriptionColor}
          dataAid='description'
          component='div'
        >
          {description}
        </Typography>
      )}
    </Stack>
  );
};

export default CardVertical;

CardVertical.propTypes = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  description: PropTypes.node,
  descriptionColor: PropTypes.string,
  onClick: PropTypes.func,
  imgProps: PropTypes.object,
  className: PropTypes.string,
  dataAid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

CardVertical.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  imgProps: {},
};
