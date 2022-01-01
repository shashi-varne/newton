import { Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import './HeaderTitle.scss';

const HeaderTitle = ({ ImgSrc, title, subTitle, tagVariant }) => {
  return (
    <div className='ht-wrapper'>
      <Imgc src={ImgSrc} style={{ width: '40px', height: '40px' }} />
      <div className='ht-text-wrapper'>
        <Typography variant='heading2'>{title}</Typography>
        {subTitle && (
          <Typography
            className='ht-subtitle'
            variant='body2'
            color='foundationColors.content.secondary'
          >
            {subTitle}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default HeaderTitle;
