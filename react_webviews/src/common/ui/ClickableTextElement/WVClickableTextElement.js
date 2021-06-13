import './WVClickableTextElement.scss';
import React, { useEffect, useState } from 'react';
import { getConfig } from '../../../utils/functions';

const WVClickableTextElement = ({ className, children, onClick, color, dataAidSuffix }) => {
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
      style={textColor ? { color: textColor } : {}}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

export default WVClickableTextElement;