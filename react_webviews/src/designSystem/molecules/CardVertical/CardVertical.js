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
  imgProps
}) => {
  return (
    <Box
      onClick={onCardClick}
      className={`cv-wrapper ${elevation && 'cv-elevation'}`}
      sx={cvSxStyle}
    >
      <Imgc src={imgcSrc} style={{ width: '32px', height: '32px' }} {...imgProps}/>
      <Typography className='cv-mt-4' variant='body1' color={titleColor}>
        {title}
      </Typography>
      <Typography
        variant='body2'
        className='cv-mt-4'
        color={subtitleColor}
      >
        {subtitle}
      </Typography>
      <Typography
        variant='body2'
        className='cv-mt-4'
        color={descriptionColor}
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