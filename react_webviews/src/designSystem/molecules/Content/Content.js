/*
  props description:
  title, subtitle => string/node
  titleColor, subtitleColor: strongly recommended to use foundation colors.
  Example:
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';
import Icon from '../../atoms/Icon';
import isFunction from 'lodash/isFunction';
import Stack from '@mui/material/Stack';

import './Content.scss';
import '../../utils/style.scss';

const Content = ({
  imgSrc,
  imgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  description,
  descriptionColor,
  onClick,
  className,
  dataAid,
  sx,
}) => {
  return (
    <Stack
      direction='row'
      className={`blog-content-wrapper ${className} ${isFunction(onClick) && 'content-cursor'}`}
      onClick={onClick}
      data-aid={`content_${dataAid}`}
      sx={sx}
      spacing={2}
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
      <Stack direction='column'>
        {title && (
          <Typography variant='body1' color={titleColor} component='div' dataAid='title'>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant='body2' color={subtitleColor} dataAid='subtitle' component='div'>
            {subtitle}
          </Typography>
        )}
        {description && (
          <Typography
            variant='body5'
            color={descriptionColor}
            dataAid='description'
            component='div'
          >
            {description}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

Content.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  descriptionColor: 'foundationColors.content.secondary',
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
