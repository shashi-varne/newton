import './WVHeaderText.scss';
import React from 'react';

const WVHeaderText = ({
  children
}) => {
  return (
    <div className="wv-header-text">
      {children}
    </div>
  );
}

export default WVHeaderText;