import React, { useState } from 'react';
import PageCloseBtn from './PageCloseBtn';
import Filters from './FilterSection';
import { PrimaryButton as Button } from '../common/Button';
import { storageService } from '../../utils/validators';
import TextField from '@material-ui/core/TextField';
import { dateFormater, date_range_selector } from '../common/commonFunctions';
import toast from '../../common/ui/Toast';
import isEmpty from 'lodash/isEmpty';
import { Dialog } from 'material-ui';

const FilterMobile = ({ clickHandler, filterOptions, filter_key, handleFilterData }) => {
  const storedFilterVal = storageService().getObject(filter_key);
  const [startDate, setStartDate] = useState(storedFilterVal['from_tdate'] || '');
  const [endDate, setEndDate] = useState(storedFilterVal['to_tdate'] || '');
  const [filterState, setFilterState] = useState(storedFilterVal || null);
  const [clearFilter, setClearFilter] = useState(false);
  const clearCheck =
    filter_key === 'iwd-holding-filters' ? filterState : filterState?.ttype || filterState?.viewFor;
  const handleFilterSelect = (id, value) => {
    let start = '';
    let end = '';
    if (id === 'viewFor' && value !== '') {
      if (value === 'select_dates') {
        setStartDate(dateFormater(new Date()));
        setEndDate(dateFormater(new Date()));
      } else {
        [start, end] = date_range_selector[value]();
        setStartDate(dateFormater(start));
        setEndDate(dateFormater(end));
      }
    }
    if (filter_key === 'iwd-holding-filters') {
      setFilterState({ ...filterState, [id]: value ? value : '' });
    } else {
      setFilterState({
        ...filterState,
        [id]: value ? value : '',
        from_tdate: start ? dateFormater(start) : '',
        to_tdate: end ? dateFormater(end) : '',
      });
    }

    setClearFilter(false);
  };

  const applyFilters = () => {
    if (!isEmpty(clearCheck)) {
      storageService().setObject(filter_key, filterState);
      handleFilterData(filterState);
    }
    clickHandler();
  };
  const clearFilters = () => {
    if (!isEmpty(clearCheck)) {
      if (filter_key === 'iwd-holding-filters') {
        setFilterState(null);
        setClearFilter(true);
        handleFilterData(null);
        storageService().setObject(filter_key, null);
      } else {
        const filterData = {
          ...storedFilterVal,
          ttype: '',
          viewFor: '',
          from_tdate: '',
          to_tdate: '',
        };
        setFilterState(filterData);
        setClearFilter(true);
        setStartDate('');
        setEndDate('');
        handleFilterData(filterData);
        storageService().setObject(filter_key, filterData);
      }
    }
  };

  const handleDateChange = (e, dateType) => {
    if (dateType === 'from_tdate') {
      setStartDate(dateFormater(e.target.value));
      setFilterState({ ...filterState, [dateType]: dateFormater(e.target.value) });
    } else {
      setEndDate(dateFormater(e.target.value));
      setFilterState({ ...filterState, [dateType]: dateFormater(e.target.value) });
    }
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
    <Dialog fullScreen={true} classes={{ paper: 'iwd-filter-mobile' }} open={true}>
      <div className='iwd-filter-mobile-container'>
        <PageCloseBtn clickHandler={clickHandler} />
        <div className='iwd-filter-mobile-section'>
          <section className='iwd-filter-head-container'>
            <div className='iwd-filter-head'>Filters</div>
          </section>
          {renderFilters()}
          {filter_key === 'iwd-transaction-filters' && (
            <>
              <div className='iwd-transaction-date-filter'>
                <div className='iwd-transaction-date'>
                  <div className='iwd-date-text'>From</div>
                  <div className='iwd-date-selector'>
                    <TextField
                      id='date'
                      type='date'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={filterState?.viewFor !== 'select_dates' || isEmpty(filterState)}
                      value={startDate}
                      onChange={(e) => handleDateChange(e, 'from_tdate')}
                    />
                  </div>
                </div>
                <div className='iwd-transaction-date'>
                  <div className='iwd-date-text'>To</div>
                  <div className='iwd-date-selector'>
                    <TextField
                      id='date'
                      type='date'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={filterState?.viewFor !== 'select_dates'  || isEmpty(filterState)}
                      value={endDate}
                      onChange={(e) => handleDateChange(e, 'to_tdate')}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className='iwd-filter-footer'>
            <div
              className={`iwd-filter-clear ${isEmpty(clearCheck) && 'iwd-disable-clear'}`}
              onClick={clearFilters}
            >
              Clear All
            </div>

            <Button onClick={applyFilters}>Apply</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterMobile;
