/*
  props description:
  title, subtitle => string/node
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Icon from '../../atoms/Icon';
import isFunction from 'lodash/isFunction';

import './Content.scss';

const Content = ({
  imgSrc,
  imgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onClick,
  className,
  dataAid,
  sx,
}) => {
  return (
    <Box
      className={`blog-content-wrapper ${className} ${isFunction(onClick) && 'content-cursor'}`}
      onClick={onClick}
      data-aid={`content_${dataAid}`}
      sx={sx}
    >
      {imgSrc && (
        <Icon
          src={imgSrc}
          className='content-left-img'
          width='100px'
          height='70px'
          dataAid='left'
          {...imgProps}
        />
      )}
      <div className='bc-text-wrapper'>
        {title && (
          <Typography variant='body1' color={titleColor} component='div' dataAid='title'>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant='body5' color={subtitleColor} dataAid='subtitle' component='div'>
            {subtitle}
          </Typography>
        )}
      </div>
    </Box>
  );
};

Content.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  imgProps: {},
};

Content.propTypes = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  onClick: PropTypes.func,
  dataAid: PropTypes.string,
  imgProps: PropTypes.object,
};

export default Content;
