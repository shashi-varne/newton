/*
  Props description:
  titleColor, subtitleColor => strongly recommended to use only foundation colors.
  Example: 
  titleColor: 'foundationColors.secondary.mango.300'
*/

import { Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './HeaderTitle.scss';

const HeaderTitle = ({ ImgSrc, children, imgProps={}, tagVariant }) => {
  return (
    <div className='ht-wrapper'>
      <Imgc src={ImgSrc} style={{ width: '40px', height: '40px'}} {...imgProps} />
      <div className='ht-text-wrapper'>{children}</div>
    </div>
  );
};

HeaderTitle.Title = ({ children, titleColor }) => {
  return (
    <Typography variant='heading2' color={titleColor}>
      {children}
    </Typography>
  );
};

HeaderTitle.Subtitle = ({ children, subtitleColor }) => {
  return (
    <Typography
      className='ht-subtitle'
      variant='body2'
      color={subtitleColor}
    >
      {children}
    </Typography>
  );
};

HeaderTitle.propTypes = {
  children: PropTypes.node,
}

HeaderTitle.Title.propTypes = {
  children: PropTypes.node,
}

HeaderTitle.Subtitle.propTypes = {
  children: PropTypes.node,
}

HeaderTitle.Subtitle.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary'
};

export default HeaderTitle;
