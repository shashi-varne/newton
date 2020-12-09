import React from 'react';
import IwdCard from '../../mini-components/IwdCard';
import { isEmpty } from 'utils/validators';
const TopHoldings = ({ topHoldings }) => {
  return (
    <div className='iwd-scroll-child' data-pgno='2'>
      <IwdCard className='iwd-analysis-card' headerText='Top holdings' error={isEmpty(topHoldings)}>
        <div className='iwd-analysis-portfolios-equity'>
          {topHoldings.map(({ instrument_name: name, share: percentage }) => (
            <div className='iwd-analysis-debt-holding' key={name}>
              <div className='iwd-analysis-debt-holding-logo'>{name.charAt(0).toUpperCase()}</div>
              <div className='iwd-analysis-debt-holding-details'>
                <div className='iwd-analysis-debt-holding-name'>{name}</div>
                <div className='iwd-analysis-debt-holding-percentage'>{percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </IwdCard>
    </div>
  );
};

export default TopHoldings;
