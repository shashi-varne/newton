/*
    Props Description:
    title(string),
    subtitle(string),
    titleColor, subtitleColor : strongly recommended to use foundation Colors.
    Example: 
    titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './MenuItem.scss';

const MenuItem = ({
  leftImgSrc,
  leftImgProps,
  rightImgSrc,
  rightImgProps,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  onItemClick,
  dataAid
}) => {
  return (
    <div className='mi-wrapper' onClick={onItemClick} data-aid={`menuItem_${dataAid}`}>
      <div className='mi-left-wrapper'>
        {
          leftImgSrc &&
            <Imgc
              src={leftImgSrc}
              style={{ width: '54px', height: '54px' }}
              className='mi-left-img'
              {...leftImgProps}
              dataAid='left'
            />
        }
        <div className='mi-text-wrapper'>
          <Typography variant='heading4' color={titleColor} component='div' data-aid='tv_title'>
            {title}
          </Typography>
          <Typography variant='body2' color={subtitleColor} component='div' data-aid='tv_subtitle'>
            {subtitle}
          </Typography>
        </div>
      </div>
      {
        rightImgSrc &&
          <Imgc
            src={rightImgSrc}
            style={{ width: '24px', height: '24px' }}
            {...rightImgProps}
            dataAid='right'
          />
      }
    </div>
  );
};

MenuItem.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  leftImgProps: {},
  rightImgProps: {}
};

MenuItem.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  dataAid: PropTypes.string,
  leftImgProps: PropTypes.object,
  rightImgProps: PropTypes.object,
  onItemClick: PropTypes.func,
};

export default MenuItem;
