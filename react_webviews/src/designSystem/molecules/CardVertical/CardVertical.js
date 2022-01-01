import React from 'react';
import { Box, Typography } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';

import './CardVertical.scss';

const CardVertical = ({
  ImgcSrc,
  title,
  titleProps,
  subTitle,
  subTitleProps,
  description,
  descriptionProps,
  variant = 'default',
  onCardClick,
}) => {
  const elevation = variant === 'elevation';
  return (
    <Box
      onClick={onCardClick}
      className={`cv-wrapper ${elevation && 'cv-elevation'}`}
      sx={cvSxStyle}
    >
      <Imgc src={ImgcSrc} style={{ width: '32px', height: '32px' }} />
      <Typography className='cv-mt-4' variant='body1' {...titleProps}>
        {title}
      </Typography>
      <Typography
        variant='body2'
        className='cv-mt-4'
        color='foundationColors.content.secondary'
        {...subTitleProps}
      >
        {subTitle}
      </Typography>
      <Typography
        variant='body2'
        className='cv-mt-4'
        color='foundationColors.content.tertiary'
        {...descriptionProps}
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
