import React, { useState, useEffect } from 'react';
import FilterDesktop from '../../mini-components/FilterDesktop';
import FilterMobile from '../../mini-components/FilterMobile';
import {
  getTransactions,
  hitNextPage,
  fetchPortfolioNames,
  downloadTransactionReport,
} from '../../common/ApiCalls';
import { transactionFilterOptions, mobileFilterOptions } from '../../constants';
import FSTable from 'common/responsive-components/FSTable';
import { transactionsHeaderMap } from '../../constants';
import Pagination from '../../mini-components/Pagination';
import { storageService } from '../../../utils/validators';
import IWdScreenLoader from '../../mini-components/IwdScreenLoader';
import 'rsuite/dist/styles/rsuite-default.css';
import debounce from 'lodash/debounce';
import filter_sign from 'assets/filter_sign.svg';
import DateRangeSelector from '../../mini-components/DateRangeSelector';
import AutoSuggestSearch from '../../mini-components/AutoSuggestSearch';
import download_icon from 'assets/download_icon.svg';
import toast from '../../../common/ui/Toast';
import { getConfig } from 'utils/functions';
transactionsHeaderMap.splice(1, 0, {
  label: 'Fund Name',
  accessor: 'mf_name',
});

const filter_key = 'iwd-transaction-filters';
const Transactions = () => {
  const [transactions, setTransactions] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [more, setMore] = useState(false);
  const [nextPageLink, setNextPageLink] = useState('');
  const [filterVal, setFilterVal] = useState(storageService().getObject(filter_key) || '');
  const [open, isOpen] = useState(false);
  const [fundNames, setFundNames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobileView = getConfig().isMobileDevice;

  useEffect(() => {
    const filterData = storageService().getObject(filter_key);
    fetch_fund_names();

    if (filterData) {
      get_transactions(filterData);
    } else {
      get_transactions();
    }
  }, []);

  useEffect(() => {
    get_transactions();
  }, [filterVal]);

  const get_transactions = async (params = {}) => {
    try {
      setIsLoading(true);
      const response = await getTransactions({
        page_size: perPage,
        count: true,
        ...filterVal,
      });
      setTransactions(response.transactions);
      setIsLoading(false);
      setTotalCount(response.total_count);
      setMore(response.more);
      setNextPageLink(response.next_page);
    } catch (err) {
      toast(err);
      console.log(err);
    }
  };

  const fetch_fund_names = async () => {
    try {
      const { funds } = await fetchPortfolioNames();
      setFundNames(funds);
    } catch (err) {
      toast(err);
      console.log(err);
    }
  };

  const handleFilterData = (val) => {
    setFilterVal({ ...filterVal, ...val });
  };

  const handleDesktopFilterData = debounce(
    (val) => {
      handleFilterData(val);
      //setFilterVal({ ...filterVal, ...val });
    },
    2000,
    { trailing: true }
  );
  const clickHandler = () => {
    isOpen(false);
  };

  const downloadTransactions = async () => {
    if (transactions?.length > 0) {
      try {
        const filterData = storageService().getObject(filter_key);
        await downloadTransactionReport('pdf', filterData);
      } catch (err) {
        toast(err);
        console.log(err);
      }
    } else {
      toast('No transaction to download');
    }
  };
  return (
    <div className='iwd-statement-transaction'>
      {isMobileView && open ? (
        <FilterMobile
          clickHandler={clickHandler}
          filterOptions={mobileFilterOptions}
          filter_key={filter_key}
          handleFilterData={handleFilterData}
        />
      ) : (
        <FilterDesktop
          filterOptions={transactionFilterOptions}
          filter_key={filter_key}
          handleFilterData={handleDesktopFilterData}
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
            {fundNames && (
              <AutoSuggestSearch
                placeholder='Which fund are you looking for?'
                fundNames={fundNames}
                handleFilterData={handleFilterData}
                filter_key={filter_key}
              />
            )}
          </div>

          <div className='iwd-transaction-date'>
            <div>
              <DateRangeSelector filter_key={filter_key} handleFilterData={handleFilterData} />
            </div>
          </div>
        </section>
        <section className='iwd-card iwd-transaction-table-container'>
          <div className='iwd-transaction-header'>
            <div className='iwd-transaction-title'>Transactions</div>

            <div className='iwd-transaction-download-report' onClick={downloadTransactions}>
              Download Report
            </div>

            <div className='iwd-trasaction-download-icon' onClick={downloadTransactions}>
              <img alt='download' src={download_icon} />
            </div>
          </div>
          <div className='iwd-transaction-table-data'>
            {!isLoading ? (
              <FSTable
                className='iwd-transactions-table iwd-statement-trasaction-table'
                serializeData
                headersMap={transactionsHeaderMap}
                data={transactions}
              />
            ) : (
              <IWdScreenLoader loadingText='Fetching...' />
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
              // nextPage={nextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
