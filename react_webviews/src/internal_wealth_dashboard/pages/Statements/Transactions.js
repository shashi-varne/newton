import React, { useState, useEffect } from 'react';
import FilterDesktop from '../../mini-components/FilterDesktop';
import FilterMobile from '../../mini-components/FilterMobile';
import {
  getTransactions,
  hitNextPage,
  getPortfolioFundNames,
} from '../../common/ApiCalls';
import { transactionFilterOptions, mobileFilterOptions } from '../../constants';
import FSTable from 'common/responsive-components/FSTable';
import { transactionsHeaderMap } from '../../constants';
import { Pagination } from 'rsuite';
import { isEmpty, storageService } from '../../../utils/validators';
import IWdScreenLoader from '../../mini-components/IwdScreenLoader';
import './rsuite.scss';
import debounce from 'lodash/debounce';
import filter_sign from 'assets/filter_sign.svg';
import DateRangeSelector from '../../mini-components/DateRangeSelector';
import AutoSuggestSearch from '../../mini-components/AutoSuggestSearch';
import IwdErrorScreen from '../../mini-components/IwdErrorScreen';
import download_icon from 'assets/download_icon.svg';
import toast from '../../../common/ui/Toast';
import { getConfig } from '../../../utils/functions';
import { nativeCallback } from '../../../utils/native_callback';
const transactionMapper = [...transactionsHeaderMap];
transactionMapper.splice(1, 0, {
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
  const [hasError, setHasError] = useState(false);

  const sendEvents = (user_action, props) => {
    let eventObj = {
      "event_name": 'internal dashboard hni',
      "properties": {
        screen_name: 'statements',
        "user_action": user_action,
        report_type: 'transactions',
        ...props,
      }
    };
    nativeCallback({ events: eventObj });
  };

  const pushToPageMap = (url) => {
    if (!url || !!pageMap[activePage + 1]) return;
    setPageMap([...pageMap, url]);
  };

  useEffect(() => {
    fetch_fund_names();
  }, []);

  useEffect(() => {
    get_transactions();
  }, [filterVal, activePage]);

  const get_transactions = debounce(async () => {
    try {
      setIsLoading(true);

      let response;
      if (activePage === 1) {
        response = await getTransactions({
          page_size: 10,
          ...filterVal,
        });
      } else {
        const urlToHit = pageMap[activePage];
        response = await hitNextPage(urlToHit);
      }
      pushToPageMap(response.next_page);

      setTransactions(response.transactions);
    } catch (err) {
      setHasError(true);
    }
    setIsLoading(false);
  },250,
  { trailing: true });

  const onPageSelect = (page) => {
    setActivePage(page);
  };

  const fetch_fund_names = async () => {
    try {
      const { funds } = await getPortfolioFundNames();
      setFundNames(funds);
    } catch (err) {
      toast(err);
    }
  };

  const handleFilterData = (val) => {
    setFilterVal(prevState => {
			setActivePage(1);
      setPageMap([null, null]); // reset pagination everytime filter is changed
			setIsLoading(true);
      return { ...prevState, ...val };
		});
  };

  const handleDesktopFilterData = debounce(
    (val) => {
      handleFilterData(val);
    },
    2000,
    { trailing: true }
  );

  const clickHandler = () => {
    isOpen(false);
  };

  const downloadTransactions = async () => {
    sendEvents('download_report');
    if (transactions?.length > 0) {
      try {
        const filterData = storageService().getObject(filter_key);
        const baseURL = getConfig().base_url;
        window.open(
          `${baseURL}/api/rta/download/account/summary/pdf${buildParamsFromObj(filterData)}`,
          '_blank'
        );
      } catch (err) {
        toast(err);
      }
    } else {
      toast('No transaction to download');
    }
  };

  const buildParamsFromObj = (obj) => {
    if (isEmpty(obj)) return '';

    const pStr = Object.entries(obj).reduce((paramStr, [key, val]) => {
      paramStr += `${key}=${val}&`;
      return paramStr;
    }, '?');
    return pStr.slice(0, -1);
  };

  const retry = () => {
    setHasError(false);
    get_transactions();
    fetch_fund_names();
	};
	
	const isFilterSet = () => {
    return Object.entries(filterVal).some(([, val]) => !!val);
	};

  const renderChild = () => {
    if (isLoading) {
      return (
        <IWdScreenLoader loadingText='Fetching transactions...' />
      );
    }
    if (isFilterSet() && isEmpty(transactions)) {
      return (
        <IwdErrorScreen
          hasNoData={true}
          templateErrText='Oops! We couldn’t find any data for the selected filter. Try removing or changing the filters.'
        />
      );
    } else if (isEmpty(transactions)) {
      return (
        <IwdErrorScreen
          hasNoData={true}
          templateErrText='No transactions to show'
        />
      );
    }
    return (
      <FSTable
        className='iwd-transactions-table iwd-statement-transaction-table'
        serializeData
        serialOffset={(activePage - 1) * 10}
        headersMap={transactionMapper}
        data={transactions}
      />
    );
  };

  return (
    <div className='iwd-statement-transaction'>
      <FilterMobile
        clickHandler={clickHandler}
        filterOptions={mobileFilterOptions}
        filter_key={filter_key}
        open={open}
        handleFilterData={handleFilterData}
      />
      <FilterDesktop
        filterOptions={transactionFilterOptions}
        filter_key={filter_key}
        handleFilterData={handleDesktopFilterData}
      />
      {!open && !hasError && (
        <div className='iwd-filter-button' onClick={() => isOpen(!open)}>
          <img src={filter_sign} alt='filter' />
        </div>
      )}
      {hasError && (
        <div className='iwd-statement-trans-error'>
          <IwdErrorScreen
            hasError={true}
            templateErrTitle='Oops!'
            templateErrText='Something went wrong! Please retry after some time or contact your wealth manager'
            templateBtnText='Retry'
            clickHandler={retry}
          />
        </div>
      )}
      {!hasError && (
        <div className='iwd-transaction-container'>
          <section className='iwd-transaction-search-container iwd-animatedFade'>
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
              <DateRangeSelector
                filter_key={filter_key}
                handleFilterData={handleFilterData}
                disabled={isLoading}
              />
            </div>
          </section>
          <section className='iwd-card iwd-transaction-table-container iwd-animatedFade'>
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
              {renderChild()}
            </div>
          </section>
          {!isLoading && (
            <div className='iwd-transaction-pagination'>
              <Pagination
                first
                prev
                next
                pages={pageMap.length - 1}
                activePage={activePage}
                onSelect={onPageSelect}
                classPrefix='iwd-rs-pagination rs-pagination'
              ></Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;
