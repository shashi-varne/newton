import './WVClickableTextElement.scss';
import React from 'react';

const WVClickableTextElement = ({ className, children }) => {
  return (
    <span className={`wv-clickable-text-elem ${className}`}>
      {children}
    </span>
  );
}

export default WVClickableTextElement;