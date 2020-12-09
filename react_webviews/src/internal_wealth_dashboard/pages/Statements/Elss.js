import React, { useEffect, useState } from 'react';
import StatementCard from '../../mini-components/StatementCard';
import { fetchGainsElssYears } from '../../common/ApiCalls';
import toast from '../../../common/ui/Toast';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import IlsNoData from 'assets/fisdom/ils_no_data.svg';
import IlsNoDataMob from 'assets/fisdom/ils_no_data_mob.svg';
import { getConfig } from 'utils/functions';
import ErrorScreen from '../../../common/responsive-components/ErrorScreen';
import ScrollTopBtn from '../../mini-components/ScrollTopBtn';
const isMobileView = getConfig().isMobileDevice;
const Elss = () => {
  const title = 'ELSS report';
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fetchElssYears = async () => {
    try {
      setIsLoading(true);
      const { tax_statement } = await fetchGainsElssYears();
      setYears(tax_statement?.elss);
      setIsLoading(false);
    } catch (err) {
      //toast(err);
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
        noData={!years?.length}
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
