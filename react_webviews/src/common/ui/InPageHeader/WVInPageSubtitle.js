import './commonStyles.scss';
import React from 'react';

const WVInPageSubtitle = ({ className, children, dataAidSuffix, ...props }) => {
  return (
    <div className={`wv-ip-subtitle ${className}`} {...props} data-aid={`wv-ip-subtitle-${dataAidSuffix}`}>
      {children}
    </div>
  );
}

export default WVInPageSubtitle;