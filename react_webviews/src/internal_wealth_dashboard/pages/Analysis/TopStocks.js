import React from 'react';
import IwdCard from '../../mini-components/IwdCard';
import { isEmpty } from 'utils/validators';
import { topStocksIconMappings } from '../../constants';
const TopStocks = ({ topStocks }) => {
  return (
    <div className='iwd-scroll-child' data-pgno='2'>
      <IwdCard
        className='iwd-analysis-card'
        headerText='Top stocks in portfolio'
        error={isEmpty(topStocks)}
      >
        <div className='iwd-analysis-portfolios-equity'>
          {topStocks?.map(
            ({ holding_sector_name: heading, instrument_name: company, share: percentage }) => (
              <div className='iwd-analysis-portfolio-stock' key={company}>
                <picture>
                  <img src={topStocksIconMappings[heading]} alt={heading} />
                </picture>
                <main>
                  <div className='iwd-analysis-portfolio-heading'>{heading}</div>
                  <div className='iwd-analysis-portfolio-name'>{company}</div>
                  <div className='iwd-analysis-portfolio-percentage'>{percentage}%</div>
                </main>
              </div>
            )
          )}
        </div>
      </IwdCard>
    </div>
  );
};

export default TopStocks;
