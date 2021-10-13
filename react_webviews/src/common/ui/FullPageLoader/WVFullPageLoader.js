/*
  Use: A full page loader, as the name suggests, with a circular loader in the 
      center and with provision to show some loading text

  Example syntx:
    <WVFullPageLoader
      classes={{ container: "custom-container-class" }}
      loadingText="Loading text goes here ..."
    />
*/
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