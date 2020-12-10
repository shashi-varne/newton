import React, { useEffect, useState } from 'react';
import StatementCard from '../../mini-components/StatementCard';
import { fetchGainsElssYears } from '../../common/ApiCalls';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import { getConfig } from 'utils/functions';
import ScrollTopBtn from '../../mini-components/ScrollTopBtn';
const isMobileView = getConfig().isMobileDevice;
const CapitalGainTax = () => {
  const title = 'Capital gain tax';
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fetchCapitalYears = async () => {
    try {
      setIsLoading(true);
      const { tax_statement } = await fetchGainsElssYears();
      setYears(tax_statement?.capital_gains);
      setIsLoading(false);
    } catch (err) {
      setHasError(true);
      setIsLoading(false);
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
        error={hasError}
        noData={!years?.length}
        noDataText="No Tax reports to display"
      >
        <div className='iwd-statement-reports'>
          {years.map((el, idx) => (
            <StatementCard key={idx} year={el} sType='capital_gains' />
          ))}
        </div>
        {isMobileView && years?.length > 3 && <ScrollTopBtn />}
      </SnapScrollContainer>
    </div>
  );
};

export default CapitalGainTax;
