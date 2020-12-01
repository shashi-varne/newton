import React, { useState, useEffect } from 'react';
import FilterDesktop from '../../mini-components/FilterDesktop';
import FilterMobile from '../../mini-components/FilterMobile';
import { getTransactions, hitNextPage, fetchPortfolioNames } from '../../common/ApiCalls';
import { transactionFilterOptions } from '../../constants';
import FSTable from 'common/responsive-components/FSTable';
import { transactionsHeaderMap } from '../../constants';
import Pagination from '../../mini-components/Pagination';
import AutoSuggest from '../../../common/ui/Autosuggest';
import DropdownInPage from '../../../common/ui/DropdownInPage';
import { isEmpty, storageService } from '../../../utils/validators';
import { past_seven_days, dateFormater } from '../../common/commonFunctions';
import 'rsuite/dist/styles/rsuite-default.css';
import moment from 'moment';
// import { DateRangePicker } from 'react-date-range';
import { DateRangePicker } from 'rsuite';
import debounce from 'lodash/debounce';
import filter_sign from 'assets/filter_sign.svg';
import AutoSuggestSearch from '../../mini-components/AutoSuggestSearch';
import { subDays, startOfMonth, addMonths, endOfMonth, startOfYear } from 'date-fns';
import download_icon from 'assets/download_icon.svg';
transactionsHeaderMap.splice(1, 0, {
  label: 'Fund Name',
  accessor: 'mf_name',
});
const ViewForOptions = [
  {
    id: 'viewFor',
    category: 'View For',
    filters: [
      {
        label: 'past 7 days',
        value: 'past 7 days',
      },
      {
        label: 'past 2 weeks',
        value: 'past 2 weeks',
      },
      {
        label: 'past months',
        value: 'past months',
      },
    ],
  },
];
const mobileFilterOptions = [...transactionFilterOptions, ...ViewForOptions];
const data = [
  {
    key: 'hdfc',
    value: 'HDFC',
  },
  {
    key: 'axis',
    value: 'AXIS',
  },
  {
    key: 'aditya_birla_sun_life',
    value: 'Aditya Birla Sun Life',
  },
  {
    key: 'nippon_india',
    value: 'RoNippon India',
  },
  {
    key: 'mirae_assets',
    value: 'Mirae Assets',
  },
];
const filter_key = 'iwd-transaction-filters';
const Transactions = () => {
  const [transactions, setTransactions] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [more, setMore] = useState(false);
  const [nextPageLink, setNextPageLink] = useState('');
  const [filterVal, setFilterVal] = useState(storageService().getObject(filter_key) || '');
  const [clearFilter, setClearFilter] = useState(false);
  const [checkSelectedBox, setCheckSelectedBox] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [open, isOpen] = useState(false);
  const [fundNames, setFundNames] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const get_transactions = async (params = {}) => {
    try {
      setIsLoading(true);
      const response = await getTransactions({
        page_size: perPage,
        count: true,
        ...filterVal,
        ...startDate,
        ...endDate,
        ...params,
        ...searchVal,
      });
      setTransactions(response.transactions);
      setIsLoading(false);
      setTotalCount(response.total_count);
      setMore(response.more);
      setNextPageLink(response.next_page);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const filterData = storageService().getObject(filter_key);
    fetch_fund_names();
    if (filterData) {
      get_transactions(filterData);
    } else {
      get_transactions();
    }
  }, []);
  const fetch_fund_names = async () => {
    try {
      const { funds } = await fetchPortfolioNames();
      setFundNames(funds);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    get_transactions();
  }, [filterVal, startDate, endDate, searchVal]);

  const nextPage = async () => {
    try {
      const response = await hitNextPage(nextPageLink);
    } catch (err) {
      console.log(err);
    }
  };

  const applyFilters = (value, id) => {
    if (!open) {
      //get_transactions({ ttype: value[id] });
      storageService().setObject(filter_key, value);
    } else {
      const transaction_filter = storageService().getObject(filter_key);
      setFilterVal(transaction_filter);
      if (transaction_filter.viewFor) {
        console.log(transaction_filter.viewFor);
      }
      const [start, end] = past_seven_days();
      console.log('start', dateFormater(start));
      console.log('end', dateFormater(end));
      //storageService().setObject(filter_key, filterVal);
      isOpen(false);
    }
  };

  const handleSearch = (obj) => {
    console.log('onchange', obj);
    if (obj) {
      setSearchVal({ amfi: obj.value });
    } else {
      setSearchVal(null);
    }
  };
  const handleMobileFilter = (id, value) => {
    storageService().setObject(filter_key, { ...filterVal, [id]: value });
    if (clearFilter) {
      setClearFilter(false);
    }
    setCheckSelectedBox(true);
  };

  const handleDesktopFilter = debounce(
    (id, value) => {
      setFilterVal((prevState) => {
        applyFilters({ ...prevState, [id]: value }, id);

        return { ...prevState, [id]: value };
      });
      if (clearFilter) {
        setClearFilter(false);
      }
      setCheckSelectedBox(true);
    },
    2000,
    { trailing: true }
  );

  const clearFilters = () => {
    if (filterVal) {
      get_transactions();
      setFilterVal('');
      setClearFilter(true);
      setCheckSelectedBox(false);
      storageService().setObject(filter_key, null);
    }
  };
  const selectDate = (value) => {
    const [start, end] = value;
    const startDate = moment(new Date(start)).format('YYYY-MM-DD');
    const endDate = moment(new Date(end)).format('YYYY-MM-DD');
    console.log('start date', start);
    console.log('end date', end);
    setStartDate({ from_tdate: startDate });
    setEndDate({ to_tdate: endDate });
  };

  const clearDate = () => {
    setStartDate('');
    setEndDate('');
  };
  const clickHandler = () => {
    isOpen(false);
  };

  return (
    <div className='iwd-statement-transaction'>
      {open ? (
        <FilterMobile
          clearFilters={clearFilters}
          clearFilter={clearFilter}
          handleFilterSelect={handleMobileFilter}
          clickHandler={clickHandler}
          applyFilters={applyFilters}
          filterOptions={mobileFilterOptions}
          checkSelectedBox={checkSelectedBox}
          filter_key={filter_key}
        />
      ) : (
        <FilterDesktop
          clearFilters={clearFilters}
          clearFilter={clearFilter}
          handleFilterSelect={handleDesktopFilter}
          filterOptions={transactionFilterOptions}
          filter_key={filter_key}
        />
      )}
      {!open && (
        <div className='iwd-filter-button' onClick={() => isOpen(!open)}>
          <img src={filter_sign} alt='filter' />
        </div>
      )}
      <div className='iwd-transaction-container'>
        <section className='iwd-transaction-search-container'>
          <div className='iwd-transaction-search'>
            <AutoSuggestSearch
              placeholder='Search for a transaction'
              fundNames={fundNames}
              handleChange={handleSearch}
            />
          </div>

          <div className='iwd-transaction-date'>
            <div>
              <DateRangePicker
                appearance='subtle'
                placement='bottomEnd'
                disabledDate={DateRangePicker.afterToday()}
                ranges={[
                  {
                    label: 'Past 7 days',
                    value: past_seven_days(),
                    // value: [subDays(new Date(), 6), new Date()],
                  },
                  {
                    label: 'Past 2 weeks',
                    value: [subDays(new Date(), 13), new Date()],
                  },
                  {
                    label: 'Past month',
                    value: [
                      startOfMonth(addMonths(new Date(), -1)),
                      endOfMonth(addMonths(new Date(), -1)),
                    ],
                  },
                  {
                    label: 'Month to date',
                    value: [startOfMonth(new Date()), subDays(new Date(), 1)],
                  },
                  {
                    label: 'Year to date',
                    value: [startOfYear(new Date()), subDays(new Date(), 1)],
                  },
                ]}
                onOk={(value) => selectDate(value)}
                onChange={(value) => selectDate(value)}
                onClean={clearDate}
              />
            </div>
          </div>
        </section>
        <section className='iwd-card iwd-transaction-table-container'>
          <div className='iwd-transaction-header'>
            <div className='iwd-transaction-title'>Transactions</div>

            <div className='iwd-transaction-download-report'>Download Report</div>

            <div className='iwd-trasaction-download-icon'>
              <img alt='download' src={download_icon} />
            </div>
          </div>
          <div className='iwd-transaction-table-data'>
            {!isLoading ? (
              <FSTable
                // className='iwd-transactions-table'
                serializeData
                headersMap={transactionsHeaderMap}
                data={transactions}
              />
            ) : (
              <h1>Loading ..!</h1>
            )}
          </div>
        </section>
        {perPage && totalCount > 0 && !isLoading && (
          <div className='iwd-transaction-pagination'>
            <Pagination
              per_page={perPage}
              totalCount={totalCount}
              more={more}
              nextPageApi={hitNextPage}
              nextPage={nextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
