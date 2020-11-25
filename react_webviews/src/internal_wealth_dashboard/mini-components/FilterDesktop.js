import React from 'react';
import Filters from './FilterSection';
import { storageService } from '../../utils/validators';
import { HoldingFilterOptions } from './../constants';
import isEmpty from 'lodash/isEmpty';
const FilterDesktop = ({ clearFilters, clearFilter, handleFilterSelect }) => {
  const filterData = storageService().getObject('iwd-filter-options');
  const renderFilters = () => (
    <div>
      {HoldingFilterOptions?.map((type) => {
        return (
          <Filters
            key={type.id}
            id={type.id}
            type={type.category}
            filterList={type.filters}
            onFilterChange={handleFilterSelect}
            clearFilter={clearFilter}
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
