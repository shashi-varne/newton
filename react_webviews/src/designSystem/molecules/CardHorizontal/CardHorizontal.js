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
  dataAid,
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
    <Box className={`ch-wrapper ${heroCardVariant && 'ch-hero-wrapper'}`} onClick={onCardClick} data-aid={`cardHorizontal_${dataAid}`}>
      <div>
        {!heroCardVariant && (
          <Imgc
            src={iconSrc}
            style={{ width: '32px', height: '32px' }}
            {...iconProps}
            data-aid='top'
          />
        )}
        {title && (
          <Typography
            className='mt-4'
            variant={titleVariant}
            color={heroCardStyle?.titleColor || titleColor}
            data-aid='tv_title'
          >
            {title}
          </Typography>
        )}
        {status && <div className='mt-4'>{status}</div>}
        {subtitle && (
          <Typography className='mt-4' variant='body2' color={heroCardStyle?.subtitleColor || subtitleColor} data-aid='tv_subtitle'>
            {subtitle}
          </Typography>
        )}
        {description && (
          <Typography className='mt-4' variant='body2' color={descriptionColor} data-aid='tv_description'>
            {description}
          </Typography>
        )}
        <Button
          className={`mt-4 btn-text ${heroCardVariant && 'btn-primary'}`}
          variant='text'
          data-aid='button_link'
        >
          {actionLink}
        </Button>
      </div>
      <Imgc
        src={ilstSrc}
        style={{ width: '110px', height: '110px', marginLeft: '4px' }}
        {...ilstProps}
        data-aid='right'
      />
    </Box>
  );
};

CardHorizontal.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
};

export default CardHorizontal;
