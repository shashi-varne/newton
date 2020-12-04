import React, { useEffect, useState } from 'react';
import StatementCard from '../../mini-components/StatementCard';
import { fetchGainsElssYears } from '../../common/ApiCalls';
import SnapScrollContainer from '../../mini-components/SnapScrollContainer';
import IlsNoData from 'assets/fisdom/ils_no_data.svg';
import IlsNoDataMob from 'assets/fisdom/ils_no_data_mob.svg';
import { getConfig } from 'utils/functions';
import ErrorScreen from '../../../common/responsive-components/ErrorScreen';
import ScrollTopBtn from '../../mini-components/ScrollTopBtn';
const isMobileView = getConfig().isMobileDevice;
const CapitalGainTax = () => {
  const title = 'Capital gain tax';
  const [years, setYears] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fetchCapitalYears = async () => {
    try {
      setIsLoading(true);
      const { tax_statement } = await fetchGainsElssYears();
      console.log('tax', tax_statement?.capital_gains);
      setYears(tax_statement?.capital_gains);
      setIsLoading(false);
    } catch (err) {
      //toast(err);
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
      >
        {years?.length > 0 ? (
          <div className='iwd-statement-reports'>
            {years.map((el, idx) => (
              <StatementCard key={idx} year={el} sType='capital_gains' />
            ))}
          </div>
        ) : (
          <ErrorScreen
            useTemplate={true}
            templateImage={isMobileView ? IlsNoDataMob : IlsNoData}
            templateErrText='No Tax report to display'
          />
        )}
        {isMobileView && years?.length > 3 && <ScrollTopBtn />}
      </SnapScrollContainer>
    </div>
  );
};

export default CapitalGainTax;
