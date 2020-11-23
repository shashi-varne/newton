import React from 'react';
import IwdComputerIcon from '../../assets/fisdom/iwd-computer.svg';

import { topStocks } from '../constants';

function EquityAnalysis() {
  return (
    <div className="iwd-scroll-child" data-pgno="2">
      <div className="iwd-analysis-card iwd-card-margin">
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-analysis-portfolios-equity">
          {topStocks.map(({ heading, company, percentage }) => (
            <div className="iwd-analysis-portfolio-stock" key={company}>
              <picture>
                <img src={IwdComputerIcon} alt={heading} />
              </picture>
              <main>
                <div className="iwd-analysis-portfolio-heading">{heading}</div>
                <div className="iwd-analysis-portfolio-name">{company}</div>
                <div className="iwd-analysis-portfolio-percentage">
                  {percentage}
                </div>
              </main>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EquityAnalysis;
