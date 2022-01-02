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
  imgProps = {},
  title,
  titleColor,
  subtitle,
  subtitleColor,
}) => {
  return (
    <div className='bc-wrapper'>
      <Imgc
        src={imgSrc}
        style={{ height: '62px', width: '92px', padding: '4px' }}
        {...imgProps}
      />
      <div className='bc-text-wrapper'>
        <Typography variant='body1' color={titleColor}>
          {title}
        </Typography>
        <Typography
          variant='body5'
          color={subtitleColor}
        >
          {subtitle}
        </Typography>
      </div>
    </div>
  );
};

BlogContent.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary'
};

BlogContent.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default BlogContent;
