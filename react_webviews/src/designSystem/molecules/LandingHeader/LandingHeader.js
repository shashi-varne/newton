/*
  Prop description:
  LandingHeader:
    variant: one of type => 'center', 'slide', 'date'

  LandingHeader.Title:
    titleColor: strongly recommended to only use foundation colors.
    
  LandingHeader.Subtitle:
    variant: will inherit the variant from the parent.
    date: if variant is date then bydefault the current date will be picked, but this value can be overriden.
    subtitleColor, dateColor: strongly recommended to only use foundation colors.

  LandingHeader.Description:
    - This will show a list of text, and the list depends upon the direct descendant elements passed.
    - we can change the color of the Typography by passing our own color(color should be from foundation colors)
    NOTE: USE TYPOGRAPHY COMPONENT AS CHILDS INSIDE THIS.
  
  Usage of the component:
   <LandingHeader variant='date'>
      <LandingHeader.Title>Title</LandingHeader.Title>
      <LandingHeader.Subtitle>
        These funds essentially invest in stocks. I am the subtitle
      </LandingHeader.Subtitle>
      <LandingHeader.Description>
        <Typography>One line text, limit - 46 characters or 9 words 46 characters or 9 words 9 words 46 characters or 9 words</Typography>
        <Typography>One line text, limit - 46 characters or 9 words</Typography>
        <Typography color='foundationColors.secondary.profitGreen.300'>One line text, limit - 46 characters or 9 words</Typography>
      </LandingHeader.Description>
    </LandingHeader>

  Example to pass color:
    titleColor: 'foundationColors.secondary.mango.300'
*/

import React, { Children } from 'react';
import { Box, Typography } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import './LandingHeader.scss';

const LandingHeader = ({
  variant,
  children,
  imageSrc,
  imageProps = {},
  dataAid,
}) => {
  const variantClass = variant === 'center' ? 'center-align' : '';
  return (
    <Box
      className={`landing-header-wrapper ${variantClass}`}
      data-aid={`landingHeader_${dataAid}`}
    >
      <Imgc
        src={imageSrc}
        style={{ width: '140px', height: '120px' }}
        {...imageProps}
        dataAid='top'
      />
      {Children.map(children, (el) => {
        return React.cloneElement(el, {
          variant,
        });
      })}
    </Box>
  );
};

LandingHeader.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['side', 'center', 'date']),
  dataAid: PropTypes.string,
};

LandingHeader.Title = ({ children, titleColor }) => {
  return (
    <Typography variant='heading1' color={titleColor} data-aid='tv_title' component='div'>
      {children}
    </Typography>
  );
};

LandingHeader.Subtitle = ({
  children,
  date,
  variant,
  subtitleColor,
  dateColor,
}) => {
  let formattedDate = {};
  const isDateVariant = variant === 'date';
  if (isDateVariant) {
    date = date ? date : new Date();
    formattedDate.date = format(date, 'MMM d, yyyy ');
    formattedDate.time = format(date, ' h:mma');
  }
  return (
    <div>
      {isDateVariant && (
        <Typography
          className='lh-date-wrapper'
          variant='body2'
          color={dateColor}
          data-aid='tv_date'
          component='div'
        >
          {formattedDate?.date}
          <span>{'\u2022'}</span>
          {formattedDate?.time}
        </Typography>
      )}

      <Typography
        className='lh-subtitle'
        variant='body2'
        color={subtitleColor}
        data-aid='tv_subtitle'
        component='div'
      >
        {children}
      </Typography>
    </div>
  );
};

LandingHeader.Description = ({ children }) => {
  return (
    <ul className='lh-description-list'>
      {Children.map(children, (el, idx) => {
        return (
          <li key={idx} className='lh-description-item'>
            {React.cloneElement(el, {
              variant: 'body2',
              color: el?.props?.color || 'foundationColors.content.secondary',
              'data-aid': `tv_point_${idx + 1}`,
            })}
          </li>
        );
      })}
    </ul>
  );
};

LandingHeader.Title.propTypes = {
  children: PropTypes.node,
};

LandingHeader.Subtitle.propTypes = {
  children: PropTypes.node,
  subtitleColor: PropTypes.string,
  dateColor: PropTypes.string,
};

LandingHeader.Description.propTypes = {
  children: PropTypes.node,
};

LandingHeader.Subtitle.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  dateColor: 'foundationColors.content.secondary',
};

export default LandingHeader;
