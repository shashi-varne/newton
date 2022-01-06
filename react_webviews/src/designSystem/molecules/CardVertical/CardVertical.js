/*
  prop types:
  titleColor, subtitleColor, descriptionColor: stringly recommended to use only foundation colors.
  Example: 
  titleColor: 'foundationColors.secondary.mango.300'
  elevation(bool): this will enable the box shadow and will remove border from the card. 
  onCardClick(function): control the behaviour of the card when clicked.
*/

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './CardVertical.scss';

const CardVertical = ({
  imgcSrc,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
  elevation,
  onCardClick,
  imgProps,
  dataAid
}) => {
  return (
    <Box
      onClick={onCardClick}
      className={`cv-wrapper ${elevation && 'cv-elevation'}`}
      sx={cvSxStyle}
      data-aid={`cardVertical_${dataAid}`}
    >
      <Imgc src={imgcSrc} style={{ width: '32px', height: '32px' }} dataAid='top' {...imgProps}/>
      <Typography className='cv-mt-4' variant='body1' color={titleColor} data-aid='tv_title'>
        {title}
      </Typography>
      <Typography
        variant='body2'
        className='cv-mt-4'
        color={subtitleColor}
        data-aid='tv_subtitle'
      >
        {subtitle}
      </Typography>
      <Typography
        variant='body2'
        className='cv-mt-4'
        color={descriptionColor}
        data-aid='tv_description'
      >
        {description}
      </Typography>
    </Box>
  );
};

export default CardVertical;

const cvSxStyle = {
  border: '1px solid',
  borderColor: 'foundationColors.supporting.athensGrey',
  borderRadius: '12px',
};

CardVertical.propTypes = {
  elevation: PropTypes.bool,
  onCardClick: PropTypes.func,
}

CardVertical.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  imgProps: {}
}