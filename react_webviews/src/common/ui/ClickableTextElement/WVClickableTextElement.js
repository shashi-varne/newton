
/*

Use: Clickable text element (used usually in secondary color) for low-emphasis CTAs or Links

Example syntax:
  <WVClickableTextElement onClick={onClickFunction} color="#D6D6D6">
    Hello World
  </WVClickableTextElement>

*/

import './WVClickableTextElement.scss';
import React, { useEffect, useState } from 'react';
import { getConfig } from '../../../utils/functions';
import PropTypes from 'prop-types';

const WVClickableTextElement = ({
  className, // class name to apply to parent element
  children, // content to show
  onClick,
  color, // to set content text color - values: #FFF (HEX color code) [OR] primary/secondary/etc. (mui theme config/partner config)
  dataAidSuffix,
  style // inline style object to apply to parent element
}) => {
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    if (color) {
      if (color.toString().includes('#')) {
        setTextColor(color);
      } else {
        const colorHex = getConfig().styles?.[`${color}Color`];
        setTextColor(colorHex || getConfig().styles?.secondaryColor);
      }
    }
  }, [color]);

  return (
    <span
      data-aid={`wv-clickable-text-elem-${dataAidSuffix}`}
      className={`wv-clickable-text-elem ${className}`}
      style={{ ...style, color: textColor || '' }}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

WVClickableTextElement.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object
}

WVClickableTextElement.defaultProps = {
  className: '',
  style: {}
}

export default WVClickableTextElement;