import './commonStyles.scss';
import React from 'react';

const WVInPageTitle = ({ className, children, ...props }) => {
  return (
    <div className={`wv-ip-title ${className}`} {...props}>
      {children}
    </div>
  );
}

export default WVInPageTitle;