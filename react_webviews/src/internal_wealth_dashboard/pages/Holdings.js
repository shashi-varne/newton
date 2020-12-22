// ----------------- Assets ----------------------
import IlsNoData from 'assets/fisdom/ils_no_data.svg';
import IlsNoDataMob from 'assets/fisdom/ils_no_data_mob.svg';
import filter_sign from 'assets/filter_sign.svg';
// -----------------------------------------------
import React, { useEffect, useState } from 'react';
import PageHeader from '../mini-components/PageHeader';
import { getConfig } from 'utils/functions';
import HoldingCard from '../mini-components/HoldingCard';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import FilterDesktop from '../mini-components/FilterDesktop';
import FilterMobile from '../mini-components/FilterMobile';
import { getHoldings } from '../common/ApiCalls';
import toast from '../../common/ui/Toast';
import { isEmpty, storageService } from '../../utils/validators';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
import { HoldingFilterOptions } from './../constants';
import ScrollTopBtn from '../mini-components/ScrollTopBtn';
import { scrollElementToPos } from '../common/commonFunctions';
const isMobileView = getConfig().isMobileDevice;
const schemeMap = {
  hybrid: ['hybrid', 'hybrid (c)', 'hybrid (nc)'],
  equity: ['equity', 'equity(g)', 'balanced', 'fof', 'equity(s)'],
  debt: ['debt', 'bond', 'income', 'mip', 'gilt', 'liquid'],
  elss: ['elss'],
};
const filter_key = 'iwd-holding-filters';
const Holdings = () => {
  const [holdingsList, setHoldingsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [open, isOpen] = useState(false);
  const [filterVal, setFilterVal] = useState(storageService().getObject(filter_key) || null);
  const [filterData, setFilterData] = useState(null);
  const fetchHoldings = async () => {
    try {
      setIsLoading(true);
      const result = await getHoldings();
      if (isEmpty(result)) {
        setHasError(true);
      }
      setHoldingsList(result);
      if (filterVal) {
        filter(result);
      }
    } catch (e) {
      console.log(e);
      setHasError(true);
      toast(e);
    }
    setIsLoading(false);
  };

  const currentValue = (current_value_type) => {
    const lac = 100000;
    switch (current_value_type) {
      case 1:
        return {
          min: 0,
          max: lac,
        };
      case 2:
        return {
          min: lac,
          max: 5 * lac,
        };
      case 3:
        return {
          min: 5 * lac,
          max: 10 * lac,
        };

      case 4:
        return {
          max: 10 * lac,
        };
      default:
        return {
          min: '',
          max: '',
        };
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  useEffect(() => {
    filter(holdingsList);
    scrollElementToPos('iwd-scroll-contain', 0, 0);
  }, [filterVal]);

  const checkSchemeType = (filterSchemeType, currentSchemeType) => {
    return schemeMap[filterSchemeType].includes(currentSchemeType);
  };

  const filter = (data) => {
    setIsLoading(true);
    let newData = [];

    if (filterVal) {
      newData = data.filter((el) => {
        let bool = true;
        if (
          filterVal?.scheme_type &&
          !checkSchemeType(filterVal?.scheme_type.toLowerCase(), el.scheme_type.toLowerCase())
        ) {
          bool = false;
        }
        if (bool && filterVal?.fisdom_rating) {
          let fisdomRating = parseInt(filterVal?.fisdom_rating, 10);
          bool = fisdomRating === 1 ? el.mf.fisdom_rating <= 3 : el.mf.fisdom_rating >= 4;
        }
        if (bool && filterVal?.current_value_type) {
          let currentValueType = parseInt(filterVal?.current_value_type, 10);
          if (currentValueType === 4) {
            bool = el.current > currentValue(currentValueType).max;
          } else {
            bool =
              el.current >= currentValue(currentValueType).min &&
              el.current <= currentValue(currentValueType).max;
          }
        }
        return bool;
      }); 
    } else {
      newData = [...holdingsList];
    }
    
    setTimeout(() => {
      if (newData?.length > 0) {
        setFilterData(newData);
      } else {
        setFilterData(null);
      }
      setIsLoading(false);
    }, 500);
  };

  const clickHandler = () => {
    isOpen(false);
  };
  const handleFilterData = (filterData) => {
    setFilterVal(filterData);
  };
  return (
    <div className='iwd-page' id='iwd-holdings'>
      <PageHeader>
        <div className='iwd-header-title'>
          Holdings
        </div>
      </PageHeader>
      <FilterMobile
        clickHandler={clickHandler}
        filterOptions={HoldingFilterOptions}
        filter_key={filter_key}
        open={open}
        handleFilterData={handleFilterData}
      />
      <section style={{ display: 'flex', width: '100%' }}>
        {!open && (
          <FilterDesktop
            handleFilterData={handleFilterData}
            filterOptions={HoldingFilterOptions}
            filter_key={filter_key}
          />
        )}
        <div style={{ flex: '1' }}>
          <SnapScrollContainer
            hideFooter={true}
            error={hasError}
            onErrorBtnClick={fetchHoldings}
            isLoading={isLoading}
            loadingText='Fetching ...'
            scrollOnChange={true}
          >
            {!filterData && (
              <ErrorScreen
                classes={{
                  container: 'iwd-fade',
                }}
                useTemplate={true}
                templateImage={isMobileView ? IlsNoDataMob : IlsNoData}
                templateErrText='Oops! We couldn’t find any data for the selected filter. Try removing or changing the filter.'
              />
            )}
            {(filterData || []).map((holding, idx) => <HoldingCard {...holding} key={idx} />)}
            {isMobileView && (filterData || []).length > 1 && <ScrollTopBtn />}
          </SnapScrollContainer>
          {!open && !hasError && (
            <div className='iwd-filter-button' onClick={() => isOpen(!open)}>
              <img src={filter_sign} alt='filter' />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Holdings;
