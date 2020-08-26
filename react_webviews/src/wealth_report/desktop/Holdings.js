import React, { useEffect, useState, Fragment } from "react";
import HoldingCard from "../mini-components/HoldingCard";
import Filter from "../mini-components/Filter";
import FilterMobile from "../mini-components/FilterMobile";
import toast from '../../common/ui/Toast';
import { fetchHoldings, hitNextPage } from "../common/ApiCalls";
import DotDotLoader from '../../common/ui/DotDotLoader';
import { CircularProgress } from "material-ui";

export default function Holdings(props) {
  const [nextPage, setNextPage] = useState('');
  const [loadingMore, setLoadMore] = useState(false);
  const [holdingsData, setHoldingsData] = useState([]);
  const [selectedFilters, setFilters] = useState({});
  const [noHoldings, setNoHoldings] = useState(false);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setNoHoldings(false);
        const data = await fetchHoldings({ pan: props.pan, ...selectedFilters });
        if (!data.holdings || !data.holdings.length) {
          setNoHoldings(true);
        }
        setHoldingsData(data.holdings);
        setNextPage(data.next_page);
      } catch(err) {
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

  return (
    <div id="wr-holdings">
      {/* will be hidden for the mobile view visible for desktop view */}
      <Filter
        onFilterChange={(filterObj) => setFilters(Object.assign({}, selectedFilters, filterObj))}
      />

      {/* will be hidden for the desktop view and visible for mobile view */}
      <FilterMobile
        onFilterChange={(filterObj) => setFilters(Object.assign({}, selectedFilters, filterObj))}
      />

      {noHoldings && <div>No holdings found</div>}

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

      {!isLoading && !!holdingsData.length && holdingsData.map((holding, idx) => (
        <HoldingCard
          key={idx}
          holding={holding}
          pan={props.pan}
          parentProps={props.parentProps}
        />
      ))}
      <div
        className="wr-load-more"
        style={{ justifyContent: 'center', fontSize: '18px', marginTop: '70px' }}
        onClick={loadMoreEntries}>
        {!!nextPage && loadingMore && (
          <Fragment><CircularProgress size={20} /> &nbsp;&nbsp; Fetching ...</Fragment>
        )}
        {!!nextPage && !loadingMore && !isLoading && 'Load More'}
      </div>
    </div>
  );
};
