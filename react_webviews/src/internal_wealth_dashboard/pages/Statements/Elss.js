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
        error={hasError}
      >
        {years?.length > 0 ? (
          <div className='iwd-statement-reports'>
            {years.map((el, idx) => (
              <StatementCard key={idx} year={el} sType='elss' />
            ))}
          </div>
        ) : (
          <ErrorScreen
            useTemplate={true}
            templateImage={isMobileView ? IlsNoDataMob : IlsNoData}
            templateErrText='No Tax report to display'
          />
        )}
        {isMobileView && years?.length > 0 && <ScrollTopBtn />}
      </SnapScrollContainer>
    </div>
  );
};

export default Elss;
