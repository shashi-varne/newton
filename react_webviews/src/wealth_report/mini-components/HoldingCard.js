import React, { useState, useEffect, Fragment } from 'react';
import WrButton from '../common/Button';
import { IconButton } from 'material-ui';
import { numDifferentiationInr, formattedDate, inrFormatDecimal2 } from '../../utils/validators';
import AMCDetail from './AMCDetail';
import { CircularProgress } from 'material-ui';
import { navigate } from '../common/commonFunctions';
import WrTable from './WrTable';
import { fetchTransactions, hitNextPage } from '../common/ApiCalls';
import { toast } from 'react-toastify';
import { getConfig } from "utils/functions";
import CardLoader from './CardLoader';
const isMobileView = getConfig().isMobileDevice;
const tableHeadersMap = [{
  label: 'Date',
  accessor: 'date',
  formatter: (val) => formattedDate(val, 'd m, y', true),
}, {
  label: 'Type',
  accessor: 'type',
}, {
  label: 'Amount',
  accessor: 'amount',
  formatter: (val) => inrFormatDecimal2(val),
}];

export default function HoldingCard(props) {
  const [expanded, expandCard] = useState(false);
  const [tabSelected, selectTab] = useState('fund');
  const [loadingMore, setLoadMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const { holding = {} } = props;
  const { fund_summary = {} } = holding;

  useEffect(() => {
    (async() => {
      try {
        if (tabSelected === 'transactions') {
          setLoading(true);
          const data = await fetchTransactions({
            pan: props.pan,
            isin: holding.isin,
            page_size: 10,
          });
          setTransactions(data.transactions);
          setNextPage(data.next_page);
        }
      } catch (err) {
        console.log(err);
        toast(err);
      }
      setLoading(false);
    })();
  }, [tabSelected]);
  
  const renderFundDetails = () => (
    <div id="wr-hce-fund-details">
      <div>
        <span className="wr-small-col-val">{formattedDate(fund_summary.fund_start_date, 'd m, y', true)}</span>
        <span className="wr-small-col-title">Launch Date</span>
      </div>
      <div>
        <span className="wr-small-col-val">{numDifferentiationInr(fund_summary.aum)}</span>
        <span className="wr-small-col-title">AUM</span>
      </div>
      <div>
        <span className="wr-small-col-val">{`${Number(fund_summary.one_year_return).toFixed(1)}%`}</span>
        <span className="wr-small-col-title">1 Year Return</span>
      </div>
      <div id="wr-hce-space"></div> {/*This div is required to create space for mobile view*/}
      <div>
        <span className="wr-small-col-val">{`${Number(fund_summary.three_year_return).toFixed(1)}%`}</span>
        <span className="wr-small-col-title">3 Year Return</span>
      </div>
      <div>
        <span className="wr-small-col-val">{`${Number(fund_summary.five_year_return).toFixed(1)}%`}</span>
        <span className="wr-small-col-title">5 Year Return</span>
      </div>
    </div>
  );

  const renderPastTransactions = () => {
    return (
      <Fragment>
        <div className="wr-hce-past-trx wr-table-container">
          {isLoading ?
            (<CardLoader />) :
            (<WrTable
              data={transactions}
              headersMap={tableHeadersMap}
              errorMsg="Currently, no data to show"
            />)
          }
        </div>
        <div
          className="wr-load-more"
          onClick={seeMoreClicked}>
          {!!nextPage && loadingMore && (
            <Fragment><CircularProgress size={20}/> &nbsp;&nbsp; Fetching ...</Fragment>
          )}
          {!!nextPage && !loadingMore && isMobileView && 'View All'}
          {!!nextPage && !loadingMore && !isMobileView && 'See More'}
        </div>
      </Fragment>
    );
  }

  const seeMoreClicked = async() => {
    try {
      if (isMobileView) {
        navigate(props.parentProps, 'transactions', {
          holding,
          pan: props.pan,
        });
      } else {
        setLoadMore(true);
        const { transactions: data, next_page } = await hitNextPage(nextPage);
        setTransactions([...transactions, ...data]);
        setNextPage(next_page);
      }
      setLoadMore(false);
    } catch(err) {
      console.log(err);
      toast(err);
    }
  };

  return (
    <div className="wr-card-template wr-holding">
      {/* based on the condition visbility is modified */}
      {holding.free_from_el_lockin && 
        <div className="wr-free-EL-label">
          <img src={require('assets/fisdom/free_from_el_tag.png')} alt="Lock-in free" />
        </div>
      }
      <div className="wr-holding-card" onClick={() => expandCard(!expanded)}>
        {AMCDetail(holding)}
        <div className="wr-hc-user-data">
          <div className="wr-small-col">
            <span className="wr-small-col-val">{numDifferentiationInr(holding.total_amount_invested)}</span>
            <span className="wr-small-col-title">Invested Amount</span>
          </div>
          <div className="wr-small-col">
            <span className="wr-small-col-val">{numDifferentiationInr(holding.current_value)}</span>
            <span className="wr-small-col-title">Current Value</span>
          </div>
          <div className="wr-small-col">
            <span className="wr-small-col-val">{holding.xirr ? parseInt(holding.xirr || 0, 10) : 'N/A'}%</span>
            <span className="wr-small-col-title">IRR</span>
          </div>
          <div>
            <IconButton classes={{ root: 'wr-icon-button' }} color="inherit" aria-label="Menu">
              <img
                src={require(`assets/fisdom/${expanded ? 'down_arrow_fisdom' : 'ic-right-chevron' }.svg`)}
                alt="expand"
                style={{ cursor: 'pointer' }}/>
            </IconButton>
          </div>
        </div>
      </div>
      {expanded ? 
        (<div className="wr-holding-card-expand">
          <div className="wr-holdings-btn">
            {[
              {tabName: 'fund', label: 'Fund Summary'},
              {tabName: 'transactions', label: 'Past Transactions'},
              ].map(({ tabName, label }) => (
              <WrButton
                key={label}
                classes={{
                  root: tabSelected === tabName ? '' : 'wr-outlined-btn'
                }}
                style={{ marginRight: '16px' }}
                onClick={() => selectTab(tabName)}
                disableRipple>
                {label}
              </WrButton>
              )
            )}
          </div>
          <div>
            {tabSelected === 'fund' ?
              renderFundDetails() : renderPastTransactions()
            }
          </div>
        </div>) : ''
      }
    </div>
  );
};