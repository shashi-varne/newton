import './commonStyles.scss';
import React from 'react';

const WVInPageTitle = ({ className, children, dataAidSuffix, ...props }) => {
  return (
    <div className={`wv-ip-title ${className}`} {...props} data-aid={`wv-ip-title-${dataAidSuffix}`}>
      {children}
    </div>
  );
}

export default WVInPageTitle;