import { Box, Typography } from '@mui/material';
import format from 'date-fns/format';
import React, { Children } from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import './LandingHeader.scss';

const LandingHeader = ({ variant, children, date, imageSrc, imageProps = {} }) => {
  const variantClass = variant === 'center' ? 'center-align' : '';
  return (
    <Box className={`landing-header-wrapper ${variantClass}`}>
      <Imgc
        src={imageSrc}
        style={{ width: '140px', height: '120px' }}
        {...imageProps}
      />
      {Children.map(children, (el) => {
          return React.cloneElement(el, {
            variant,
            date
          });
        }
      )}
    </Box>
  );
};

LandingHeader.Title = ({ children }) => {
  return <Typography variant='heading1'>{children}</Typography>;
};

LandingHeader.Subtitle = ({ children, date, variant }) => {
  let formattedData;
  if(variant === 'date') {
    date = date ? date : new Date();
    formattedData = format(date, 'MMM d, yyyy, h:mma');
  }
  return (
    <div>
      {date && (
        <Typography className='lh-date-wrapper' variant='body2' color='foundationColors.content.secondary'>
          {formattedData}
        </Typography>
      )}

      <Typography
        className='lh-subtitle'
        variant='body2'
        color='foundationColors.content.secondary'
      >
        {children}
      </Typography>
    </div>
  );
};

export default LandingHeader;
