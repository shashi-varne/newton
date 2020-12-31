import React, { useEffect, useState } from 'react';
import Filters from './FilterSection';
import { storageService } from '../../utils/validators';

import isEmpty from 'lodash/isEmpty';
const FilterDesktop = ({ filterOptions, filter_key, handleFilterData }) => {
  const storedFilterVal = storageService().getObject(filter_key);
  const [filterState, setFilterState] = useState(
    !isEmpty(storedFilterVal) ? storedFilterVal : null
  );
  const [clearFilter, setClearFilter] = useState(false);
  const [canClear, setCanClear] = useState(false);

  useEffect(() => {
    if (filterState) {
      const isFilterSet = Object.keys(filterState).some(filterKey => filterState[filterKey]);
      setCanClear(isFilterSet);
    }
  }, [filterState]);

  const handleFilterSelect = (id, value) => {
    let filterData;
    if (filterState) {
      filterData = { ...filterState, [id]: value };
    } else {
      filterData = { [id]: value };
    }
    setFilterState(filterData);
    storageService().setObject(filter_key, filterData);
    handleFilterData(filterData);
    setClearFilter(false);
  };

  const clearFilters = () => {
    if (!canClear) return;
    if (filter_key === 'iwd-transaction-filters') {
      handleFilterData({ ttype: '' });
    } else {
      handleFilterData(null);
    }
    setFilterState(null);
    setClearFilter(true);
    storageService().setObject(filter_key, null);
    setCanClear(false);
  };

  const renderFilters = () => (
    <div>
      {filterOptions?.map((type) => {
        return (
          <Filters
            key={type.id}
            id={type.id}
            type={type.category}
            filterList={type.filters}
            onFilterChange={handleFilterSelect}
            clearFilter={clearFilter}
            filter_key={filter_key}
          />
        );
      })}
    </div>
  );
  return (
    <div
      style={{
        // flex: '0.2',
        marginRight: '30px',
        borderRight: '2px solid #f0f1f5',
        minWidth: '200px',
      }}
      className='iwd-filter-desktop iwd-fadeFromLeft'
    >
      <section className='iwd-filter-head-container'>
        <div className='iwd-filter-head'>Filters</div>
        <div
          className={`iwd-filter-clear ${!canClear && 'iwd-disable-clear'}`}
          onClick={clearFilters}
        >
          Clear All
        </div>
      </section>
      {renderFilters()}
    </div>
  );
};

export default FilterDesktop;
