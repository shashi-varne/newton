import React from 'react';
import Filters from './FilterSection';
import { storageService } from '../../utils/validators';

import isEmpty from 'lodash/isEmpty';
const FilterDesktop = ({
  clearFilters,
  clearFilter,
  handleFilterSelect,
  filterOptions,
  filter_key,
}) => {
  const filterData = storageService().getObject(filter_key);
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
      style={{ flex: '0.2', marginRight: '30px', borderRight: '2px solid #f0f1f5' }}
      className='iwd-filter-desktop'
    >
      <section className='iwd-filter-head-container'>
        <div className='iwd-filter-head'>Filters</div>
        <div
          className={`iwd-filter-clear ${isEmpty(filterData) && 'iwd-disable-clear'}`}
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
