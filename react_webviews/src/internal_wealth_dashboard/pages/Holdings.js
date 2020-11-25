import React, { useEffect, useState } from 'react';
import PageHeader from '../mini-components/PageHeader';
import { getConfig } from 'utils/functions';
import HoldingCard from '../mini-components/HoldingCard';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';

import filter_sign from 'assets/filter_sign.svg';
import FilterDesktop from '../mini-components/FilterDesktop';
import FilterMobile from '../mini-components/FilterMobile';
import { holdings } from '../common/ApiCalls';
import { dummyHoldings } from './../constants';
import toast from '../../common/ui/Toast';
import { storageService } from '../../utils/validators';
const isMobileView = getConfig().isMobileDevice;

const Holdings = () => {
  const [holdingsList, setHoldingsList] = useState([]);
  const [open, isOpen] = useState(false);
  const [filterVal, setFilterVal] = useState(
    storageService().getObject('iwd-filter-options') || null
  );
  const [filterData, setFilterData] = useState(null);
  const [clearFilter, setClearFilter] = useState(false);
  const [checkSelectedBox, setCheckSelectedBox] = useState(false);
  const fetchHoldings = async () => {
    try {
      // const result = await holdings();
      setHoldingsList(dummyHoldings);
      if (filterVal) {
        filter(dummyHoldings);
      }
    } catch (e) {
      console.log(e);
      toast(e);
    }
  };
  const lac = 100000;
  const currentValue = (current_value_type) => {
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

      default:
        return {
          max: 10 * lac,
        };
    }
  };

  const schemeMap = {
    hybrid: ['hybrid', 'hybrid (c)', 'hybrid (nc)'],
    equity: ['equity', 'equity(g)', 'balanced', 'fof', 'equity(s)'],
    debt: ['debt', 'bond', 'income', 'mip', 'gilt', 'liquid'],
    elss: ['elss'],
  };
  useEffect(() => {
    fetchHoldings();
  }, []);

  const checkSchemeType = (filterSchemeType, currentSchemeType) => {
    return schemeMap[filterSchemeType].includes(currentSchemeType);
  };

  const filter = (data) => {
    const newData = data.filter((el) => {
      let bool = true;
      if (
        filterVal?.scheme_type &&
        !checkSchemeType(filterVal?.scheme_type.toLowerCase(), el.scheme_type.toLowerCase())
      ) {
        bool = false;
      }
      if (bool && filterVal?.fisdom_rating) {
        let fisdomRating = parseInt(filterVal?.fisdom_rating);
        bool = fisdomRating === 1 ? el.mf.fisdom_rating <= 3 : el.mf.fisdom_rating >= 4;
      }
      if (bool && filterVal?.current_value_type) {
        let currentValueType = parseInt(filterVal?.current_value_type);
        bool =
          el.current >= currentValue(currentValueType).min &&
          el.current <= currentValue(currentValueType).max;
      }
      return bool;
    });

    //let newData = dummy;
    // if (filterVal?.scheme_type) {
    //   newData = newData.filter((el) => {
    //     const scheme = setSchemeType(
    //       el.scheme_type.toLowerCase(),
    //       filterVal?.scheme_type.toLowerCase()
    //     );
    //     return scheme.toLowerCase() === filterVal?.scheme_type.toLowerCase();
    //   });
    // }
    // if (filterVal?.fisdom_rating) {
    //   let fisdomRating = parseInt(filterVal?.fisdom_rating);
    //   newData = newData.filter((el) =>
    //     fisdomRating === 1 ? el.mf.fisdom_rating <= 3 : el.mf.fisdom_rating >= 4
    //   );
    // }
    // if (filterVal?.current_value_type) {
    //   let currentValueType = parseInt(filterVal?.current_value_type);
    //   newData = newData.filter(
    //     (el) =>
    //       el.current >= currentValue(currentValueType).min &&
    //       el.current <= currentValue(currentValueType).max
    //   );
    // }
    if (newData?.length > 0) {
      setFilterData(newData);
    } else {
      setFilterData(null);
    }
  };

  useEffect(() => {
    if (filterVal && holdingsList?.length > 0) {
      filter(holdingsList);
    }
  }, [filterVal]);
  const applyFilters = (value) => {
    if (value) {
      storageService().setObject('iwd-filter-options', value);
    } else {
      storageService().setObject('iwd-filter-options', filterVal);
    }
    isOpen(false);
  };
  const clearFilters = () => {
    if (filterVal) {
      setFilterVal(null);
      setClearFilter(true);
      setCheckSelectedBox(false);
      storageService().setObject('iwd-filter-options', null);
    }
  };
  const handleFilterSelect = (id, value) => {
    setFilterVal((prevState) => {
      if (!open) {
        applyFilters({ ...prevState, [id]: value });
      }
      return { ...prevState, [id]: value };
    });
    if (clearFilter) {
      setClearFilter(false);
    }
    setCheckSelectedBox(true);
  };
  const clickHandler = () => {
    isOpen(false);
  };

  return (
    <div className='iwd-page' id='iwd-holdings'>
      <PageHeader height={isMobileView ? '7vh' : '9vh'} hideProfile={isMobileView}>
        <>
          <div className='iwd-header-title'>Holdings</div>
        </>
      </PageHeader>
      {open && (
        <FilterMobile
          clearFilters={clearFilters}
          clearFilter={clearFilter}
          handleFilterSelect={handleFilterSelect}
          clickHandler={clickHandler}
          applyFilters={applyFilters}
          checkSelectedBox={checkSelectedBox}
        />
      )}
      <section style={{ display: 'flex', width: '100%' }}>
        {!open && (
          <FilterDesktop
            clearFilters={clearFilters}
            clearFilter={clearFilter}
            handleFilterSelect={handleFilterSelect}
          />
        )}
        <div style={{ flex: '1' }}>
          <>
            {!open && (
              <div className='iwd-filter-button' onClick={() => isOpen(!open)}>
                <img src={filter_sign} alt='filter' />
              </div>
            )}
            <SnapScrollContainer hideFooter={true} error={false}>
              <>
                {filterVal
                  ? filterData?.map((holding) => <HoldingCard {...holding} />)
                  : holdingsList.map((holding) => <HoldingCard {...holding} />)}
              </>
            </SnapScrollContainer>
          </>
        </div>
      </section>
    </div>
  );
};

export default Holdings;
