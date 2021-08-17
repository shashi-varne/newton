import React from 'react';
import IwdCard from '../../mini-components/IwdCard';
import { isEmpty } from 'utils/validators';
import { topStocksIconMappings } from '../../constants';
import { formatPercentVal } from '../../common/commonFunctions';
const TopStocks = ({ topStocks = [] }) => {
  return (
    <div className='iwd-scroll-child' data-pgno='2'>
      <IwdCard
        className='iwd-analysis-card'
        headerText='Top stocks in portfolio'
        noData={isEmpty(topStocks)}
        noDataText="Oops! There is no data to show here currently."
      >
        <div className='iwd-analysis-portfolios-equity'>
          {topStocks?.map(
            ({ holding_sector_name: heading, instrument_name: company, share: percentage }) => (
              <div className='iwd-analysis-portfolio-stock' key={company}>
                <picture>
                  <img
                    src={topStocksIconMappings[heading] || topStocksIconMappings['Others']}
                    alt={heading}
                  />
                </picture>
                <main>
                  <div className='iwd-analysis-portfolio-heading'>{heading}</div>
                  <div className='iwd-analysis-portfolio-name'>{company}</div>
                  <div className='iwd-analysis-portfolio-percentage'>{formatPercentVal(percentage)}</div>
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
