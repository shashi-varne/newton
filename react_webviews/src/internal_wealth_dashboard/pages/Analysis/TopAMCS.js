import React from 'react';
import IwdCard from '../../mini-components/IwdCard';
import { isEmpty } from 'utils/validators';
const TopAMCS = ({ topAMCs }) => {
  return (
    <div className='iwd-scroll-child' data-pgno='3'>
      <IwdCard
        className='iwd-analysis-card'
        headerText='Top Stocks in portfolio'
        error={isEmpty(topAMCs)}
      >
        <div className='iwd-analysis-top-amcs'>
          {topAMCs.map(({ amc_logo: logo, amc_name: name, share: percentage }) => (
            <div className='iwd-analysis-amc' key={name}>
              <img src={logo} alt={name} className='iwd-analysis-amc-logo' />
              <main>
                <div className='iwd-analysis-amc-name'>{name}</div>
                <div className='iwd-analysis-amc-percentage'>{percentage}%</div>
              </main>
            </div>
          ))}
        </div>
      </IwdCard>
    </div>
  );
};

export default TopAMCS;
