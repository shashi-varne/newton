import React from 'react';
import Box from '@mui/material/Box';
import { Imgc } from 'common/ui/Imgc';
import { Typography } from '@mui/material';
import './InfoCard.scss';

const InfoCard = ({ ImgSrc, imgProps = {}, title, subTitle }) => {
  return (
    <Box sx={infoCardWrapperSxStyle}>
      <Imgc
        src={ImgSrc}
        style={{ height: '32px', width: '32px' }}
        {...imgProps}
      />
      <div className='ic-text-wrapper'>
        <Typography variant='heading4'>{title}</Typography>
        <Typography
          className='ic-subtitle-text'
          variant='body2'
          color='foundationColors.content.secondary'
        >
          {subTitle}
        </Typography>
      </div>
    </Box>
  );
};

export default InfoCard;

const infoCardWrapperSxStyle = {
  border: '1px solid',
  borderColor: 'foundationColors.supporting.athensGrey',
  padding: '16px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'row',
};
