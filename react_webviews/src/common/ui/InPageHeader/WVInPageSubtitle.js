import './commonStyles.scss';
import React from 'react';

const WVInPageSubtitle = ({ className, children, ...props }) => {
  return (
    <div className={`wv-ip-subtitle ${className}`} {...props}>
      {children}
    </div>
  );
}

export default WVInPageSubtitle;