import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '@mui/material/Typography';
import './BlogContent.scss';

const BlogContent = ({
  ImgSrc,
  imgProps = {},
  title,
  titleProps = {},
  subtitle,
  subtitleProps = {},
}) => {
  return (
    <div className='bc-wrapper'>
      <Imgc
        src={ImgSrc}
        style={{ height: '62px', width: '92px', padding: '4px' }}
        {...imgProps}
      />
      <div className='bc-text-wrapper'>
        <Typography variant='body1' {...titleProps}>
          {title}
        </Typography>
        <Typography
          variant='body5'
          color='foundationColors.content.secondary'
          {...subtitleProps}
        >
          {subtitle}
        </Typography>
      </div>
    </div>
  );
};

export default BlogContent;
