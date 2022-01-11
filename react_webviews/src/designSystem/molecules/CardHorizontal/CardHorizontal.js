/*
  prop description:
  title, subtitle, description, footerText: =>  PropTypes.oneOfType([PropTypes.string, PropTypes.node]
    - use node only if some part of the text is having different style like color/foont weight.
  titleColor,  subtitleColor, descriptionColor, footerTextColor
    - these accepts all the foundation colors.
    Example :
      footerTextColor: 'foundationColors.secondary.mango.300'
  onActionClick: will trigger the event when action button is clicked.
  onCardClick: will trigger the event when card is clicked.
  variat: you can seleect either two of them => 'product' or 'herocard'
*/


import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import Button from '../../atoms/Button';
import Status from '../../atoms/Status';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';

import './CardHorizontal.scss';

const CardHorizontal = ({
  iconSrc,
  iconProps,
  ilstSrc,
  ilstProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
  actionLink,
  onActionClick,
  status,
  statusTitle,
  onCardClick,
  dataAid,
  footerText,
  footerTextColor,
  footerBackground,
  variant = 'product',
}) => {
  const isHeroCardVariant = variant === 'heroCard';
  const titleVariant = isHeroCardVariant ? 'heading3' : 'body1';
  const actionBtnVariant = isHeroCardVariant ? 'primary' : 'link';
  const actionBtnClassName = isHeroCardVariant ? 'ch-action-btn' : 'ch-action-link-btn';
  const showFooter = isHeroCardVariant && footerText;

  const wrapperClassNames = `ch-wrapper ${
    isHeroCardVariant && 'ch-hero-wrapper'
  } ${isFunction(onActionClick) && 'default-pointer'}`;

  const heroCardStyle = useMemo(() => {
    if (isHeroCardVariant) {
      titleColor = 'foundationColors.supporting.white';
      subtitleColor = 'foundationColors.primary.200';
      return {
        titleColor,
        subtitleColor,
      };
    }
  }, []);

  const onActionLinkClick = (e) => {
    if (isFunction(onActionClick)) {
      e.stopPropagation();
      onActionClick(e);
    }
  };
  return (
    <Box
      className={wrapperClassNames}
      onClick={onCardClick}
      data-aid={`cardHorizontal_${dataAid}`}
    >
      <Box className='ch-top-section-wrapper'>
        <div>
          {iconSrc && (
            <Imgc
              src={iconSrc}
              style={{ width: '32px', height: '32px' }}
              {...iconProps}
              dataAid='top'
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
          {statusTitle && status && (
            <Status variant={status} title={statusTitle} />
          )}
          {subtitle && (
            <Typography
              className='mt-4'
              variant='body2'
              color={heroCardStyle?.subtitleColor || subtitleColor}
              data-aid='tv_subtitle'
            >
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography
              className='mt-4'
              variant='body2'
              color={descriptionColor}
              data-aid='tv_description'
            >
              {description}
            </Typography>
          )}
          {actionLink && (
            <Button
              variant={actionBtnVariant}
              className={actionBtnClassName}
              title={actionLink}
              isInverted
              size='small'
              onClick={onActionLinkClick}
            />
          )}
        </div>
        <Imgc
          src={ilstSrc}
          style={{ width: '110px', height: '110px', marginLeft: '4px' }}
          {...ilstProps}
          dataAid='right'
        />
      </Box>
      {showFooter && (
        <Box className='ch-bottom-section-wrapper' sx={{background: footerBackground}}>
          <Typography variant='body5' color={footerTextColor}>
            {footerText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

CardHorizontal.propTypes = {
  iconProps: PropTypes.object,
  ilstProps: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitleColor: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  descriptionColor: PropTypes.string,
  actionLink: PropTypes.string,
  onActionClick: PropTypes.func,
  status: PropTypes.string,
  statusTitle: PropTypes.string,
  onCardClick: PropTypes.func,
  dataAid: PropTypes.string,
  footerText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  footerTextColor: PropTypes.string,
  footerBackground: PropTypes.string,
  variant: PropTypes.oneOf(['product', 'heroCard']),
}

CardHorizontal.defaultProps = {
  variant: 'product',
  iconProps: {},
  ilstProps: {},
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.tertiary',
  footerTextColor: 'foundationColors.supporting.white',
  footerBackground: 'linear-gradient(180deg, rgba(51, 207, 144, 0.2) 27.54%, rgba(130, 121, 248, 0.13) 100%)'
};

export default CardHorizontal;
