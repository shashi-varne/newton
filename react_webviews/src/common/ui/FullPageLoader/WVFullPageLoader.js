import './WVFullPageLoader.scss';
import React from 'react';

const WVFullPageLoader = ({
  classes,
  loadingText
}) => {
  return (
    <div className={`wv-full-page-loader ${classes?.container}`}>
      <div className="wv-fpl-overlay">

        <div className="wv-fpl-loading-circle"></div>
        <div className="wv-fpl-loading-text">{loadingText}</div>
      </div>
    </div>
  );
}

export default WVFullPageLoader;