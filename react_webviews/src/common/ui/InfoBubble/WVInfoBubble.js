import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from 'utils/functions';
import SVG from 'react-inlinesvg';

const TYPES = {
  'info': {
    icon: 'badge-info',
    iconColor: '#6650AB', // getConfig().styles.primaryColor
    bgColor: '#E8E0FF',
    titleColor: '#6650AB',
    title: 'Note',
  },
  'warning': {
    icon: 'badge-warning',
    iconColor: '#FFDA2C',
    bgColor: '#FFF6CE',
    titleColor: '#B39712',
    title: 'Pending',
  },
  'error': {
    icon: 'badge-error',
    iconColor: '#BA3366',
    bgColor: '#FFE0EC',
    titleColor: '#8C0E1E',
    title: 'Error',
  },
  'success': {
    icon: 'badge-success',
    iconColor: '#35CB5D',
    bgColor: '#E0FFBF',
    titleColor: '#4D890D',
    title: 'Success',
  }
}

const WVInfoBubble = ({
  isDismissable,
  hasTitle,
  customTitle,
  type,
  children
}) => {
  const typeConfig = TYPES[type] || {};

  return (
    <div className='wv-info-bubble' style={{ backgroundColor: typeConfig.bgColor }}>
      {typeConfig.icon &&
        <SVG
          className='wv-ib-icon'
          // preProcessor={code => code.replace(/fill='.*?'/g, 'fill=' + typeConfig.iconColor)}
          src={require(`assets/${typeConfig.icon}.svg`)}
        />
      }
      <div className='wv-ib-content'>
        {hasTitle &&
          <div className='wv-ib-content-title'>
            <span style={{ color: typeConfig.titleColor }}>
              {customTitle || typeConfig.title}
            </span>
            {isDismissable &&
              <img
                src={require('assets/close_icon_grey.svg')}
                alt='X'
              />
            }
          </div>
        }
        <div className='wv-ib-content-desc'>
          {children}
        </div>
      </div>
    </div>
  );
}

WVInfoBubble.propTypes = {
  isDismissable: PropTypes.bool,
  hasTitle: PropTypes.bool,
  customTitle: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(TYPES)),
  children: PropTypes.string.isRequired
};

WVInfoBubble.defaultProps = {
  isDismissable: false,
  hasTitle: false,
  type: 'info',
};

export default WVInfoBubble;