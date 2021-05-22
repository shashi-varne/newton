import './WVClickableTextElement.scss';
import React, { useEffect, useState } from 'react';
import { getConfig } from '../../../utils/functions';

const WVClickableTextElement = ({ className, children, onClick, color }) => {
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
      data-aid='clickable-text-btn'
      className={`wv-clickable-text-elem ${className}`}
      style={textColor ? { color: textColor } : {}}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

export default WVClickableTextElement;