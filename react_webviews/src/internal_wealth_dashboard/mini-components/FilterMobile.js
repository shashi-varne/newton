import React from 'react';
import PageCloseBtn from './PageCloseBtn';
import Filters from './FilterSection';
import { PrimaryButton as Button } from '../common/Button';
const FilterMobile = ({
  handleFilterSelect,
  clearFilter,
  clickHandler,
  clearFilters,
  applyFilters,
  checkSelectedBox,
  filterOptions,
  filter_key,
}) => {
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
    <section className='iwd-filter-mobile-overlay'>
      <div style={{ position: 'relative', height: '100%', padding: '30px' }}>
        <PageCloseBtn clickHandler={clickHandler} />
        <div className='iwd-filter-mobile-section'>
          <section className='iwd-filter-head-container'>
            <div className='iwd-filter-head'>Filters</div>
          </section>
          {renderFilters()}

          <div className='iwd-filter-footer'>
            <div
              className={`iwd-filter-clear ${!checkSelectedBox && 'iwd-disable-clear'}`}
              onClick={clearFilters}
            >
              Clear All
            </div>

            <Button onClick={() => applyFilters(null)}>Apply</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterMobile;
