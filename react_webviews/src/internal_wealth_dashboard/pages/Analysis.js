import React from 'react';

import PageHeader from '../mini-components/PageHeader';

import { getConfig } from 'utils/functions';

const isMobileView = getConfig().isMobileDevice;

const allocations = [
  { sector: 'Bank', allocation: 29 },
  { sector: 'Refineries/marketing', allocation: 17 },
  { sector: 'Computers-software', allocation: 11 },
  { sector: 'Engineering, designing, construction', allocation: 10 },
  { sector: 'Housing finance', allocation: 8 },
];

const topStocks = [
  { heading: 'Computer-Software', company: 'Infosys Ltd', percentage: 10.06 },
  { heading: 'Banks', company: 'HDFC Bank Ltd.', percentage: 9.12 },
  { heading: 'Refineries/Marketing', company: 'Reliance Industries Ltd', percentage: 9.12 },
  { heading: 'Computer - Software', company: 'Tata Consultancy Ltd.', percentage: 10.06 },
  { heading: 'NBFC', company: 'Bajaj Finance Ltd', percentage: 9.12 },
  { heading: 'Banks', company: 'Kotak Mahindra Bank Ltd.', percentage: 10.06 }, 

]

function Analysis() {
  return (
    <section className="iwd-page iwd-analysis" id="iwd-analysis">
      <PageHeader height={isMobileView ? '7vh' : '9vh'} hideProfile={true}>
        <div className="iwd-header-container-left">
          <h1 className="iwd-header-title">Analysis</h1>
          <div className="iwd-header-filters">
            <button className="iwd-equity-button">Equity</button>
            <button className="iwd-debt-button">Debt</button>
          </div>
        </div>
      </PageHeader>
      <div className="iwd-card" style={{ marginTop: '50px' }}>
        <h2 className="iwd-card-header">Top Sector Allocation</h2>
        <div className="iwd-sector-allocations">
          {allocations.map(({ sector, allocation}) => (<div className="iwd-sector-allocation">
            <div className="iwd-sector-name">{sector}</div>
            <div className="iwd-sector-allocation-percentage">{allocation}</div>
          </div>))}
        </div>
      </div>
      <div className="iwd-card" style={{ marginTop: '50px' }}>
        <h2 className="iwd-card-header">Top Stocks in portfolio</h2>
        <div className="iwd-sector-allocations">
          {allocations.map(({ sector, allocation}) => (<div className="iwd-sector-allocation">
            <div className="iwd-sector-name">{sector}</div>
            <div className="iwd-sector-allocation-percentage">{allocation}</div>
          </div>))}
        </div>
      </div>
    </section>
  );
}

export default Analysis;
