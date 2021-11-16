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
import React, { memo } from 'react';

const QUOTES = [
  // 'Risk comes from not knowing what you are doing.',
  // 'Money is a terrible master but an excellent servant.',
  // 'Wealth is the ability to fully experience life.',
  // 'I’d like to live as a poor man with lots of money.',
  // 'Don’t stay in bed, unless you can make money in bed.',
  // 'It takes as much energy to wish as it does to plan.',
  // 'The best thing money can buy is financial freedom.',
  'The best thing money can buy is financial freedom.'
];

const WVFullPageLoader = ({
  classes,
  loadingText,
  showQuote = true,
}) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className={`wv-full-page-loader ${classes?.container}`}>
      <div className="wv-fpl-overlay">
        <div className="wv-fpl-loading-circle"></div>
        <div className="wv-fpl-loading-text">
          {loadingText || (showQuote && quote)}
        </div>
      </div>
    </div>
  );
}

export default memo(WVFullPageLoader);
