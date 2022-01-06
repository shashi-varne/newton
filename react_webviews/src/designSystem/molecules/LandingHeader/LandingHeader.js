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

  Example to pass color:
    titleColor: 'foundationColors.secondary.mango.300'
*/



import React, { Children } from 'react';
import { Box, Typography } from '@mui/material';
import { Imgc } from '../../../common/ui/Imgc';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import './LandingHeader.scss';

const LandingHeader = ({ variant, children, imageSrc, imageProps = {}, dataAid }) => {
  const variantClass = variant === 'center' ? 'center-align' : '';
  return (
    <Box className={`landing-header-wrapper ${variantClass}`} data-aid={`landingHeader_${dataAid}`}>
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
        }
      )}
    </Box>
  );
};

LandingHeader.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['side', 'center', 'date'])
};

LandingHeader.Title = ({ children, titleColor }) => {
  return <Typography variant='heading1' color={titleColor} data-aid='tv_title'>{children}</Typography>;
};

LandingHeader.Subtitle = ({ children, date, variant, subtitleColor, dateColor }) => {
  let formattedData;
  if(variant === 'date') {
    date = date ? date : new Date();
    formattedData = format(date, 'MMM d, yyyy, h:mma');
  }
  return (
    <div>
      {variant === 'date' && (
        <Typography className='lh-date-wrapper' variant='body2' color={dateColor} data-aid='tv_subtitle'>
          {formattedData}
        </Typography>
      )}

      <Typography
        className='lh-subtitle'
        variant='body2'
        color={subtitleColor}
      >
        {children}
      </Typography>
    </div>
  );
};

LandingHeader.Title.propTypes = {
  children: PropTypes.node,
};

LandingHeader.Subtitle.propTypes = {
  children: PropTypes.node,
};

LandingHeader.Subtitle.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  dateColor: 'foundationColors.content.secondary'
};

export default LandingHeader;
