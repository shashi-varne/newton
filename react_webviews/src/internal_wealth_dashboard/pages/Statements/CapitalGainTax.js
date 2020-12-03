import React, { useEffect, useState } from 'react';
import StatementCard from '../../mini-components/StatementCard';
import { fetchGainsElssYears } from '../../common/ApiCalls';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import toast from '../../../common/ui/Toast';
import isEmpty from 'lodash';
const CapitalGainTax = () => {
  const title = 'Capital gain tax';
  const [years, setYears] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCapitalYears = async () => {
    try {
      setIsLoading(true);
      const { tax_statement } = await fetchGainsElssYears();
      console.log('tax', tax_statement?.capital_gains);
      setYears(tax_statement?.capital_gains);
      setIsLoading(false);
    } catch (err) {
      toast(err);
    }
  };

  useEffect(() => {
    fetchCapitalYears();
  }, []);

  return (
    <div className='iwd-statement-report-container'>
      <div className='iwd-statement-title'>{title}</div>
      <SnapScrollContainer
        hideFooter={true}
        onErrorBtnClick={fetchCapitalYears}
        isLoading={isLoading}
        loadingText='Fetching ...'
      >
        {!isEmpty(years) ? (
          <div className='iwd-statement-reports'>
            {years.map((el, idx) => (
              <StatementCard key={idx} year={el} sType='capital_gains' />
            ))}
          </div>
        ) : (
          <div>No data to display</div>
        )}
      </SnapScrollContainer>
    </div>
  );
};

export default CapitalGainTax;
