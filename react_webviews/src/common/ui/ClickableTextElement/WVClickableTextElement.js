import './WVClickableTextElement.scss';
import React from 'react';

const WVClickableTextElement = ({ className, children, onClick }) => {
  return (
    <span className={`wv-clickable-text-elem ${className}`} onClick={onClick}>
      {children}
    </span>
  );
}

export default WVClickableTextElement;