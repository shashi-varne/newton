import React from 'react';

import { topAMCs } from '../constants';
import SBIIcon from '../../assets/fisdom/sbi.svg';

function TopAMCS() {
  return (
    <div className="iwd-scroll-child" data-pgno="3">
    <div className="iwd-analysis-card iwd-card-margin">
      <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
      <div className="iwd-analysis-top-amcs">
        {topAMCs.map(({ name, percentage }, idx) => (
          <div className="iwd-analysis-amc" key={idx}>
            <picture>
              <img src={SBIIcon} alt={name} />
            </picture>
            <main>
              <div className="iwd-analysis-amc-name">{name}</div>
              <div className="iwd-analysis-amc-percentage">
                {percentage}
              </div>
            </main>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default TopAMCS