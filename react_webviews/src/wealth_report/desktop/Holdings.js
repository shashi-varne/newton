import React, { useEffect, useState, Fragment, useRef } from "react";
import HoldingCard from "../mini-components/HoldingCard";
import Filter from "../mini-components/Filter";
import FilterMobile from "../mini-components/FilterMobile";
import toast from '../../common/ui/Toast';
import { fetchHoldings, hitNextPage } from "../common/ApiCalls";
import DotDotLoader from '../../common/ui/DotDotLoader';
import { CircularProgress } from "material-ui";
import ErrorScreen from "../mini-components/ErrorScreen";
import { isEmpty, storageService } from "../../utils/validators";
import { getConfig } from "utils/functions";
import { debounce } from 'lodash';
import InternalStorage from "../InternalStorage";
const isMobileView = getConfig().isMobileDevice;

export default function Holdings(props) {
  const cachedFilters = storageService().getObject('wr-holdings-filter') || [];
  const [nextPage, setNextPage] = useState('');
  const [loadingMore, setLoadMore] = useState(false);
  const [holdingsData, setHoldingsData] = useState([]);
  const [selectedFilters, setFilters] = useState(!isEmpty(cachedFilters) ? cachedFilters : {});
  const [noHoldings, setNoHoldings] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [pageErr, setPageErr] = useState(false);
  const firstTimeTrigger = useRef(true);
  function usePreviousValue(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
      firstTimeTrigger.current = false;
    });
    if (firstTimeTrigger.current) return value;
    return ref.current;
  }
  const prevPan = usePreviousValue(props.pan);
  const prevFilters = usePreviousValue(selectedFilters);
  useEffect(() => {
    (async () => {
      try {
        let data = InternalStorage.getData('holdingsData');
        const haveDepsChanged = (prevPan !== props.pan) || JSON.stringify(prevFilters) !== JSON.stringify(selectedFilters);
        if (isEmpty(data) || haveDepsChanged) {
          setPageErr(false);
          setLoading(true);
          setNoHoldings(false);
          data = await fetchHoldings({ pan: props.pan, ...selectedFilters });
          InternalStorage.setData('holdingsData', data);
        }
        if (!data.holdings || !data.holdings.length) {
          setNoHoldings(true);
        }
        setHoldingsData(data.holdings);
        setNextPage(data.next_page);
      } catch(err) {
        setPageErr(true);
        console.log(err);
        toast(err);
      }
      setLoading(false);
    })();
  }, [props.pan, selectedFilters]);

  const loadMoreEntries = async () => {
    if (isLoading || loadingMore) return;
    try {
      setLoadMore(true);
      const { holdings, next_page } = await hitNextPage(nextPage);
      setHoldingsData([...holdingsData, ...holdings]);
      setNextPage(next_page);
    } catch (err) {
      console.log(err);
      toast(err);
    }
    setLoadMore(false);
  };

  const debouncedFilterChange = debounce((filterObj) => {
    const newFilters = Object.assign({}, selectedFilters, filterObj);
    setFilters(newFilters);
  }, 2000, { trailing: true }); // Debounced to prevent repeated API calls on filter clicks

  return (
    <div id="wr-holdings">
      {/* will be hidden for the mobile view visible for desktop view */}
      {!isMobileView && <Filter onFilterChange={debouncedFilterChange} />}

      {/* will be hidden for the desktop view and visible for mobile view */}
      {isMobileView && <FilterMobile onFilterChange={debouncedFilterChange} />}

      {isLoading && <div style={{
          position: 'relative',
          top: '200px',
          textAlign: 'center'
        }}>
          <DotDotLoader
            className="wr-dot-loader"
            text='Fetching data ...'
            textClass="wr-dot-loader-text"
          />
        </div>
      }

      <div style={{ marginTop: noHoldings && !isMobileView ? '100px' : '40px' }}>
        {!isLoading && !!holdingsData.length && holdingsData.map((holding, idx) => (
          <HoldingCard
            key={idx}
            holding={holding}
            pan={props.pan}
            parentProps={props.parentProps}
          />
        ))}
        {!isLoading && noHoldings && !isEmpty(selectedFilters) &&
          <ErrorScreen
            templateSvgPath="fisdom/no-filter-results"
            templateText="No results for the applied filters! Please try removing filters to see holdings data."
            useTemplate={true}
          />
        }
        {!isLoading && noHoldings && isEmpty(selectedFilters) &&
          <ErrorScreen
            templateSvgPath="fisdom/exclamation"
            templateText="No holdings to show."
            useTemplate={true}
          />
        }
        {pageErr && <ErrorScreen 
          templateSvgPath="fisdom/exclamation"
          templateText="Oops! Looks like something went wrong. Please try again later"
          useTemplate={true}
        />}
      </div>
      <div
        className="wr-load-more"
        style={{ justifyContent: 'center', fontSize: isMobileView ? '16px' : '18px', marginTop: isMobileView ? '50px' : '70px' }}
        onClick={loadMoreEntries}>
        {!!nextPage && loadingMore && (
          <Fragment><CircularProgress size={20} /> &nbsp;&nbsp; Fetching ...</Fragment>
        )}
        {!!nextPage && !loadingMore && !isLoading && 'See More'}
      </div>
    </div>
  );
};
