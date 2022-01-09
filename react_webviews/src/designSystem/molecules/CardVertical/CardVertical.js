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
  dataAid,
}) => {
  return (
    <Box
      onClick={onCardClick}
      className={`cv-wrapper ${elevation && 'cv-elevation'}`}
      sx={cvSxStyle}
      data-aid={`cardVertical_${dataAid}`}
    >
      <Imgc
        src={imgcSrc}
        style={{ width: '32px', height: '32px' }}
        {...imgProps}
        dataAid='top'
      />
      <Typography
        className='cv-mt-4'
        variant='body1'
        color={titleColor}
        data-aid='tv_title'
        component='div'
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant='body2'
          className='cv-mt-4'
          color={subtitleColor}
          data-aid='tv_subtitle'
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
          data-aid='tv_description'
          component='div'
        >
          {description}
        </Typography>
      )}
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
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  description: PropTypes.string,
  descriptionColor: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  elevation: PropTypes.bool,
  onCardClick: PropTypes.func,
};

CardVertical.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  imgProps: {},
};
