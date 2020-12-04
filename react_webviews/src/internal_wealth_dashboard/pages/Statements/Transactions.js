import React, { useState, useEffect } from 'react';
import FilterDesktop from '../../mini-components/FilterDesktop';
import FilterMobile from '../../mini-components/FilterMobile';
import { getTransactions, hitNextPage, fetchPortfolioNames } from '../../common/ApiCalls';
import { transactionFilterOptions, mobileFilterOptions } from '../../constants';
import FSTable from 'common/responsive-components/FSTable';
import { transactionsHeaderMap } from '../../constants';
import { Pagination } from 'rsuite';
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
  const [transactions, setTransactions] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [filterVal, setFilterVal] = useState(storageService().getObject(filter_key) || '');
  const [open, isOpen] = useState(false);
  const [fundNames, setFundNames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageMap, setPageMap] = useState([null, null]);
  const isMobileView = getConfig().isMobileDevice;

  const pushToPageMap = (url) => {
    if (!url) return;
    setPageMap([...pageMap, url]);
  };

  useEffect(() => {
    fetch_fund_names();
  }, []);

  useEffect(() => {
    get_transactions();
  }, [filterVal, activePage]);

  const get_transactions = async () => {
    try {
      setIsLoading(true);
      let response;
      if (activePage === 1) {
        response = await getTransactions({
          page_size: 10,
          count: false,
          ...filterVal,
        });
        if (!pageMap[2]) {
          pushToPageMap(response.next_page);
        }
      } else {
        const urlToHit = pageMap[activePage];
        response = await hitNextPage(urlToHit);
      }
      setTransactions(response.transactions);
    } catch (err) {
      toast(err);
      console.log(err);
    }
    setIsLoading(false);
  };

  const onPageSelect = (page) => {
    setActivePage(page);
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
                placeholder='Search for a transaction'
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

            <div className='iwd-transaction-download-report'>Download Report</div>

            <div className='iwd-trasaction-download-icon'>
              <img alt='download' src={download_icon} />
            </div>
          </div>
          <div className='iwd-transaction-table-data'>
            {!isLoading ? (
              <FSTable
                className='iwd-transactions-table iwd-statement-transaction-table'
                serializeData
                serialOffset={(activePage - 1) * 10}
                headersMap={transactionsHeaderMap}
                data={transactions}
              />
            ) : (
              <IWdScreenLoader loadingText='Fetching...' />
            )}
          </div>
        </section>
        {!isLoading && (
          <div className='iwd-transaction-pagination'>
            <Pagination first prev next
              pages={pageMap.length - 1}
              activePage={activePage}
              onSelect={onPageSelect}
              classPrefix="iwd-rs-pagination rs-pagination"
            ></Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
