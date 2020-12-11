import React, { useEffect, useState } from 'react';
import StatementCard from '../../mini-components/StatementCard';
import { fetchGainsElssYears } from '../../common/ApiCalls';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import { getConfig } from 'utils/functions';
import ScrollTopBtn from '../../mini-components/ScrollTopBtn';
import { isEmpty } from '../../../utils/validators';
const isMobileView = getConfig().isMobileDevice;

const Elss = () => {
  const title = 'ELSS report';
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [noData, setNoData] = useState(false);
  const fetchElssYears = async () => {
    try {
      setIsLoading(true);
      const { tax_statement } = await fetchGainsElssYears();
      if (isEmpty(tax_statement?.elss)) {
        setNoData(true);
      } else {
        setNoData(false);
        setYears(tax_statement?.elss);
      }
      setIsLoading(false);
    } catch (err) {
      setHasError(true);
      setIsLoading(false);
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
        error={hasError}
        noData={noData}
        noDataText="No ELSS reports to display"
      >
        <div className='iwd-statement-reports'>
          {years.map((el, idx) => (
            <StatementCard key={idx} year={el} sType='elss' />
          ))}
        </div>
        {isMobileView && years?.length > 3 && <ScrollTopBtn />}
      </SnapScrollContainer>
    </div>
  );
};

export default Elss;
