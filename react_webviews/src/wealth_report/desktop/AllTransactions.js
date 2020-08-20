import React, { useState, useEffect } from 'react';
import toast from '../../common/ui/Toast';
import { fetchTransactions, hitNextPage } from '../common/ApiCalls';
import AMCDetail from '../mini-components/AMCDetail';
import WrTable from '../mini-components/WrTable';
import DotDotLoader from '../../common/ui/DotDotLoader';
import { IconButton } from 'material-ui';
const tableHeadersMap = [{
  label: 'Date',
  accessor: 'date',
}, {
  label: 'Type',
  accessor: 'type',
}, {
  label: 'Amount',
  accessor: 'amount',
}];

export default function AllTransactions(props) {
  const { params = {} } = props.location;
  const [nextPage, setNextPage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [loadingMore, setLoadMore] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    (async() => {
      try {
        let data;
        setLoading(true);
        data = await fetchTransactions({
          pan: params.pan,
          isin: params.holding.isin,
          page_size: 20,
        });
        setTransactions(data.transactions);
        setNextPage(data.next_page);
      } catch(err) {
        console.log(err);
        toast(err);
      }
      setLoading(false);
    })();
  }, []);

  const loadMoreEntries = async() => {
    try {
      setLoadMore(true);
      const { transactions: data, next_page } = await hitNextPage(nextPage);
      setTransactions([...data, ...transactions]);
      setNextPage(next_page);
    } catch(err) {
      console.log(err);
      toast(err);
    }
    setLoadMore(false);
  };

  return (
    <div style={{ backgroundColor: '#f5f6f8', height: '100%' }}>
      <div style={{ background: 'white' }}>
        <IconButton onClick={() => props.history.goBack()}>
          <img
            src={require('assets/ic-mob-back.svg')}
            alt="expand"
            style={{ cursor: 'pointer' }} />
        </IconButton>
      </div>
      {/* Header with AMC Detail */}
      {AMCDetail(params.holding || {})}
      <div style={{
          margin: '16px 0 0 14px',
          fontSize: '12px',
        }}>
        Past Transactions
      </div>
      <div style={{ padding: '12px' }}>
        {/* Transactions Table */}
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
        {!isLoading && !!transactions.length &&
          <div style={{ background: 'white', padding: '20px' }}>
            <WrTable
              data={transactions}
              headersMap={tableHeadersMap}
              classes="wr-transaction-table"
            />
          </div>
        }

        {/* Load More (Pagination) */}
        {!!nextPage && !loadingMore &&
          <div className="show-more" onClick={loadMoreEntries}>
            SHOW MORE
          </div>
        }
        {loadingMore &&
          <div className="loader">Loading...</div>
        }
      </div>
    </div>
  );
}