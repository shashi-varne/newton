/*

Use: Info Bubble to show informational/error/success/warning content with ability to dismiss

Example syntax:
  <WVInfoBubble
    isDismissable
    type="warning"
    isOpen={openBubble}
    hasTitle
    {...}
  >
    Enter content here ***required***
  </WVInfoBubble>

*/


import React from 'react';
import PropTypes from 'prop-types';
// import { getConfig } from 'utils/functions';
import Fade from '@material-ui/core/Fade';
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

export const WVInfoBubble = ({
  isDismissable, // Set this flag if dismiss feature (cross on top right) is required
  isOpen, // Only required when isDismissable is true
  onDismissClick, // callback for when cross is clicked
  hasTitle, // Sets this to use the default title value from 'TYPES'
  customTitle, // Overrirdes default title value
  type, // Sets bubble type - info/warning/error/success [default='info']
  children // Info bubble content
}) => {
  const typeConfig = TYPES[type] || {};

  return (
    <Fade in={isDismissable && isOpen} timeout={350}>
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
                  onClick={onDismissClick}
                />
              }
            </div>
          }
          <div className='wv-ib-content-desc'>
            {children}
          </div>
        </div>
      </div>
    </Fade>
  );
}

WVInfoBubble.propTypes = {
  isDismissable: PropTypes.bool,
  onDismissClick: PropTypes.func,
  isOpen: PropTypes.bool,
  hasTitle: PropTypes.bool,
  customTitle: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(TYPES)),
  children: PropTypes.string.isRequired
};

WVInfoBubble.defaultProps = {
  isDismissable: false,
  onDismissClick: () => {},
  hasTitle: false,
  type: 'info',
};