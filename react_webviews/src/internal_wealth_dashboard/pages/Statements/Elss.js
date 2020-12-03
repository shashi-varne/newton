import React, { useEffect, useState } from 'react';
import StatementCard from '../../mini-components/StatementCard';
import { fetchGainsElssYears } from '../../common/ApiCalls';
import toast from '../../../common/ui/Toast';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
const Elss = () => {
  const title = 'ELSS report';
  const [years, setYears] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fetchElssYears = async () => {
    try {
      setIsLoading(true);
      const { tax_statement } = await fetchGainsElssYears();
      console.log('tax', tax_statement?.elss);
      setYears(tax_statement?.elss);
      setIsLoading(false);
    } catch (err) {
      toast(err);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchElssYears();
  }, []);
  return (
    <div className='iwd-statement-report-container'>
      <div className='iwd-statement-title'>{title}</div>
      <SnapScrollContainer
        hideFooter={true}
        onErrorBtnClick={fetchElssYears}
        isLoading={isLoading}
        loadingText='Fetching ...'
      >
        {years && (
          <div className='iwd-statement-reports'>
            {years.map((el, idx) => (
              <StatementCard key={idx} year={el} sType='elss' />
            ))}
          </div>
        )}
      </SnapScrollContainer>
    </div>
  );
};

export default Elss;
