import { Box, Button, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { Imgc } from '../../../common/ui/Imgc';

import './CardHorizontal.scss';

const CardHorizontal = ({
  iconSrc,
  iconProps = {},
  ilstSrc,
  ilstProps = {},
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
  actionLink,
  status,
  onCardClick,
  variant = 'product',
}) => {
  const heroCardVariant = variant === 'heroCard';
  const titleVariant = heroCardVariant ? 'heading3' : 'body1';
  const heroCardStyle = useMemo(() => {
    if(heroCardVariant) {
        titleColor = 'foundationColors.supporting.white';
        subtitleColor = 'foundationColors.primary.200';
        return {
            titleColor,
            subtitleColor
        }
    }
  },[]);
  return (
    <Box className={`ch-wrapper ${heroCardVariant && 'ch-hero-wrapper'}`} onClick={onCardClick}>
      <div>
        {!heroCardVariant && (
          <Imgc
            src={iconSrc}
            style={{ width: '32px', height: '32px' }}
            {...iconProps}
          />
        )}
        {title && (
          <Typography
            className='mt-4'
            variant={titleVariant}
            color={heroCardStyle?.titleColor || titleColor}
          >
            {title}
          </Typography>
        )}
        {status && <div className='mt-4'>{status}</div>}
        {subtitle && (
          <Typography className='mt-4' variant='body2' color={heroCardStyle?.subtitleColor || subtitleColor}>
            {subtitle}
          </Typography>
        )}
        {description && (
          <Typography className='mt-4' variant='body2' color={descriptionColor}>
            {description}
          </Typography>
        )}
        <Button
          className={`mt-4 btn-text ${heroCardVariant && 'btn-primary'}`}
          variant='text'
        >
          {actionLink}
        </Button>
      </div>
      <Imgc
        src={ilstSrc}
        style={{ width: '110px', height: '110px', marginLeft: '4px' }}
        {...ilstProps}
      />
    </Box>
  );
};

CardHorizontal.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
};

export default CardHorizontal;
