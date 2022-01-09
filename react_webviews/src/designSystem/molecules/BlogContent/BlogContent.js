/*
  props description:
  title(string),
  subtitle(string),
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import './BlogContent.scss';

const BlogContent = ({
  imgSrc,
  imgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onBlogClick,
  dataAid
}) => {
  return (
    <div className='bc-wrapper' onClick={onBlogClick} data-aid={`blogContent_${dataAid}`}>
      <Imgc
        src={imgSrc}
        style={{ height: '62px', width: '92px', padding: '4px' }}
        {...imgProps}
        dataAid='left'
      />
      <div className='bc-text-wrapper'>
        <Typography variant='body1' color={titleColor} component='div' data-aid='tv_title'>
          {title}
        </Typography>
        <Typography
          variant='body5'
          color={subtitleColor}
          data-aid='tv_subtitle'
          component='div'
        >
          {subtitle}
        </Typography>
      </div>
    </div>
  );
};

BlogContent.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  imgProps: {}
};

BlogContent.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  onBlogClick: PropTypes.func,
  dataAid: PropTypes.string
};

export default BlogContent;
