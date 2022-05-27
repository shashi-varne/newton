/*
    Props Description:
    leftImgSrc, rightImgSrc: path of the Image src.
    title(string),
    subtitle(string),
    titleColor, subtitleColor : strongly recommended to use foundation Colors.
    Example: 
    titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';
import Separator from '../../atoms/Separator';
import './MenuItem.scss';
import Icon from '../../atoms/Icon';

const MenuItem = ({
  leftImgSrc,
  leftImgProps,
  rightImgSrc,
  rightImgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onClick,
  dataAid,
  showSeparator,
  className,
}) => {
  return (
    <div>
      <div
        className={`menu-item-wrapper ${className}`}
        onClick={onClick}
        data-aid={`menuItem_${dataAid}`}
      >
        {leftImgSrc && (
          <Icon src={leftImgSrc} size='32px' className='menu-item-left-img' dataAid='left' {...leftImgProps} />
        )}

        <div className='mi-right-wrapper'>
          <div className='mi-text-wrapper'>
            <Typography variant='heading4' color={titleColor} component='div' dataAid='title'>
              {title}
            </Typography>
            <Typography variant='body2' color={subtitleColor} component='div' dataAid='subtitle'>
              {subtitle}
            </Typography>
          </div>
          {rightImgSrc && (
            <Icon
              src={rightImgSrc}
              size='24px'
              className='menu-item-right-img'
              dataAid='right'
              {...rightImgProps}
            />
          )}
        </div>
      </div>
      {showSeparator && <Separator marginLeft={leftImgSrc ? '72px' : '16px'} dataAid="1" />}
    </div>
  );
};

MenuItem.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  leftImgProps: {},
  rightImgProps: {},
};

MenuItem.propTypes = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  dataAid: PropTypes.string,
  leftImgProps: PropTypes.object,
  rightImgProps: PropTypes.object,
  onClick: PropTypes.func,
  showSeparator: PropTypes.bool,
};

export default MenuItem;
