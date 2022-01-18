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
import Box from '@mui/material/Box';

import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './CardVertical.scss';
import Typography from '../../atoms/Typography';

const CardVertical = ({
  imgcSrc,
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
    <Box
      onClick={onClick}
      className={`cv-wrapper ${className}`}
      sx={sx}
      data-aid={`cardVertical_${dataAid}`}
    >
      {imgcSrc && <Imgc src={imgcSrc} className='cv-img-top' dataAid='top' {...imgProps} />}
      {title && (
        <Typography
          className='cv-mt-4'
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
          className='cv-mt-4'
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
          className='cv-mt-4'
          color={descriptionColor}
          dataAid='description'
          component='div'
        >
          {description}
        </Typography>
      )}
    </Box>
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
  dataAid: PropTypes.string,
};

CardVertical.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  imgProps: {},
};
