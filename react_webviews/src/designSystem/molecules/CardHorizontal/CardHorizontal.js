/*
  prop description:
  title, subtitle, description, footerText: =>  PropTypes.oneOfType([PropTypes.string, PropTypes.node]
    - use node only if some part of the text is having different style like color/foont weight.
  titleColor,  subtitleColor, descriptionColor, footerTextColor
    - these accepts all the foundation colors.
    Example :
      footerTextColor: 'foundationColors.secondary.mango.300'
  onButtonClick: will trigger the event when action button is clicked.
  onClick: will trigger the event when card is clicked.
  variat: you can seleect either two of them => 'product' or 'herocard'
*/

import { Box } from '@mui/material';
import React from 'react';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import Status from '../../atoms/Status';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';

import './CardHorizontal.scss';
import Icon from '../../atoms/Icon';

const CardHorizontal = ({
  leftImgSrc,
  leftImgProps,
  rightImgSrc,
  rightImgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
  actionLink,
  onButtonClick,
  statusVariant,
  statusTitle,
  onClick,
  dataAid,
  footerText,
  footerTextColor,
  footerBackground,
  className,
  sx,
  variant = 'product',
}) => {
  const isHeroCardVariant = variant === 'heroCard';
  const variantStyle = getVariantStyle(isHeroCardVariant, footerText);

  const wrapperClassNames = `ch-wrapper ${isHeroCardVariant && 'ch-hero-wrapper'} ${
    isFunction(onButtonClick) && 'fc-default-pointer'
  }`;

  const onActionClick = (e) => {
    if (isFunction(onButtonClick)) {
      e.stopPropagation();
      onButtonClick(e);
    }
  };
  return (
    <Box
      className={`${wrapperClassNames} ${className}`}
      sx={{ sx }}
      onClick={onClick}
      data-aid={`cardHorizontal_${dataAid}`}
    >
      <Box className='ch-top-section-wrapper'>
        <div>
          {leftImgSrc && <Icon size='32px' src={leftImgSrc} {...leftImgProps} dataAid='top' />}
          {title && (
            <Typography
              className='mt-4'
              variant={variantStyle?.titleVariant}
              color={titleColor || variantStyle?.titleColor}
              dataAid='title'
            >
              {title}
            </Typography>
          )}
          {statusTitle && statusVariant && <Status variant={statusVariant} title={statusTitle} />}
          {subtitle && (
            <Typography
              className='mt-4'
              variant='body2'
              color={subtitleColor || variantStyle?.subtitleColor}
              dataAid='subtitle'
            >
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography
              className='mt-4'
              variant='body2'
              color={descriptionColor}
              dataAid='description'
            >
              {description}
            </Typography>
          )}
          {actionLink && (
            <Button
              variant={variantStyle?.actionBtnVariant}
              className={variantStyle?.actionBtnClassName}
              title={actionLink}
              isInverted
              size='small'
              onClick={onActionClick}
              dataAid={variantStyle?.btnDataAid}
            />
          )}
        </div>
        <Icon
          size='110px'
          src={rightImgSrc}
          style={{ marginLeft: '4px' }}
          {...rightImgProps}
          dataAid='right'
        />
      </Box>
      {variantStyle?.showFooter && (
        <Box className='ch-bottom-section-wrapper' sx={{ background: footerBackground }}>
          <Typography variant='body5' color={footerTextColor} dataAid='information'>
            {footerText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const getVariantStyle = (isHeroCardVariant = false, footerText = '') => {
  if (isHeroCardVariant) {
    return {
      titleVariant: 'heading3',
      actionBtnVariant: 'primary',
      actionBtnClassName: 'ch-action-btn',
      showFooter: footerText ? true : false,
      titleColor: 'foundationColors.supporting.white',
      subtitleColor: 'foundationColors.primary.200',
      btnDataAid: 'smallWhite',
    };
  } else {
    return {
      titleVariant: 'body1',
      actionBtnVariant: 'link',
      actionBtnClassName: 'ch-action-link-btn',
      showFooter: false,
      titleColor: '',
      subtitleColor: 'foundationColors.content.secondary',
      btnDataAid: 'link',
    };
  }
};

CardHorizontal.propTypes = {
  leftImgProps: PropTypes.object,
  rightImgProps: PropTypes.object,
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  description: PropTypes.node,
  descriptionColor: PropTypes.string,
  actionLink: PropTypes.string,
  onButtonClick: PropTypes.func,
  statusVariant: PropTypes.string,
  statusTitle: PropTypes.string,
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
  footerText: PropTypes.node,
  footerTextColor: PropTypes.string,
  footerBackground: PropTypes.string,
  variant: PropTypes.oneOf(['product', 'heroCard']),
};

CardHorizontal.defaultProps = {
  variant: 'product',
  leftImgProps: {},
  rightImgProps: {},
  descriptionColor: 'foundationColors.content.tertiary',
  footerTextColor: 'foundationColors.supporting.white',
  footerBackground:
    'linear-gradient(180deg, rgba(51, 207, 144, 0.2) 27.54%, rgba(130, 121, 248, 0.13) 100%)',
};

export default CardHorizontal;
