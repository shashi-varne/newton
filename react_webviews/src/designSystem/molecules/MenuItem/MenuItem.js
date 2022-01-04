/*
    Props Description:
    title(string),
    subtitle(string),
    titleColor, subtitleColor : strongly recommended to use foundation Colors.
    Example: 
    titleColor: 'foundationColors.secondary.mango.300'
*/

import { Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './MenuItem.scss';

const MenuItem = ({
  leftImgSrc,
  leftImgProps = {},
  rightImgSrc,
  rightImgProps = {},
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onItemClick,
}) => {
  return (
    <div className='mi-wrapper' onClick={onItemClick}>
      <div className='mi-left-wrapper'>
        <Imgc
          src={leftImgSrc}
          style={{ width: '54px', height: '54px' }}
          {...leftImgProps}
        />
        <div className='mi-text-wrapper'>
          <Typography variant='heading4' color={titleColor}>
            {title}
          </Typography>
          <Typography variant='body2' color={subtitleColor}>
            {subtitle}
          </Typography>
        </div>
      </div>
      <Imgc
        src={rightImgSrc}
        style={{ width: '24px', height: '24px' }}
        {...rightImgProps}
      />
    </div>
  );
};

MenuItem.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
};

MenuItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  leftImgProps: PropTypes.object,
  rightImgProps: PropTypes.object,
  onItemClick: PropTypes.func,
};

export default MenuItem;
