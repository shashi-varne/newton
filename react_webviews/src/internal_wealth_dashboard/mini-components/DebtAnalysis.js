import React from 'react';

import { topHoldings } from '../constants';

function DebtAnalysis() {
  return (
    <div className="iwd-scroll-child">
      <div className="iwd-analysis-card iwd-card-margin">
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-analysis-portfolios-equity">
          {topHoldings.map(({ name, percentage }) => (
            <div className="iwd-analysis-debt-holding" key={name}>
              <div className="iwd-analysis-debt-holding-logo">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="iwd-analysis-debt-holding-details">
                <div className="iwd-analysis-debt-holding-name">{name}</div>
                <div className="iwd-analysis-debt-holding-percentage">
                  {percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DebtAnalysis;
