// ---------- Image Imports ------------
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
import bg_waves_full from 'assets/bg_waves_full_screen.svg';
import bg_waves_small from 'assets/bg_waves_fund.svg';
// -------------------------------------
import React, { useEffect, useState } from 'react';
import PageCloseBtn from './PageCloseBtn';
import { formattedDate, numDifferentiationInr, nonRoundingToFixed } from 'utils/validators.js';
import toast from '../../common/ui/Toast';
import { getFundDetail, getTransactions } from '../common/ApiCalls';
import IwdScreenLoader from './IwdScreenLoader';
import IwdCardLoader from './IwdCardLoader';
import FSTable from '../../common/responsive-components/FSTable';
import { transactionsHeaderMap } from '../constants';
import ScrollTopBtn from './ScrollTopBtn';
import { Dialog } from 'material-ui';
import { getConfig } from 'utils/functions';
import RatingStar from '../../fund_details/common/RatingStar';
import { Pagination } from 'rsuite';

const isMobileView = getConfig().isMobileDevice;

const HoldingDetail = ({
  investmentDetail = {},
  isin,
  onCloseClick = () => {},
  ...props
}) => {
  const [fundDetail, setFundDetail] = useState({});
  const [isLoadingFundDetail, setIsLoadingFundDetail] = useState(true);
  const [transactions, setTransations] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [pageMap, setPageMap] = useState([null, null]);
  const [activePage, setActivePage] = useState(1);

  const pushToPageMap = (url) => {
    if (!url) return;
    setPageMap([...pageMap, url]);
  };

  const onPageSelect = (page) => {
    setActivePage(page);
  };

  const fetchHoldingDetail = async () => {
    try {
      setIsLoadingFundDetail(true);
      const result = await getFundDetail({ isin });
      setFundDetail(result.fund_attributes || {});
    } catch (e) {
      console.log(e);
      toast(e);
    }
    setIsLoadingFundDetail(false);
  };

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const result = await getTransactions({
        amfi: isin,
        page_size: 10,
      });
      if (!pageMap[2]) {
        pushToPageMap(result.next_page);
      }
      setTransations(result.transactions);
    } catch (e) {
      console.log(e);
      toast(e);
    }
    setIsLoadingTransactions(false);
  };

  useEffect(() => {
    fetchHoldingDetail();
    fetchTransactions();
  }, []);

  return (
    <Dialog fullScreen={true} open={true} classes={{ paper: 'iwd-holding-detail'}}>
      {isLoadingFundDetail ?
        <IwdScreenLoader /> :
        <>
          <div className="iwd-hd-content">
            <PageCloseBtn clickHandler={onCloseClick} />
            <div className="iwd-hdc-header">
              <img src={investmentDetail.amcLogo} alt="" height="80" />
              <div>
                <div className="iwd-hdch-title">Holdings</div>
                <div className="iwd-hdch-fund-name">
                  {investmentDetail.name}
                </div>
              </div>
            </div>
            <div>
              <RatingStar value={investmentDetail.fisdom_rating} />
            </div>
            <div className="iwd-hdc-type">
              <span className="iwd-hdct-invested">
                Since {formattedDate(investmentDetail.invested_since, 'm y')}
              </span>
              <span className="iwd-hdct-divider">|</span>
              <span className="iwd-hdct-scheme-type">
                {investmentDetail.scheme_type}
              </span>
            </div>
            <div className="iwd-hdc-info-row">
              <div className="iwd-hdc-numbers">
                <div className="iwd-hdcn-item">
                  <div className="iwd-hdcni-value current-val">
                    {numDifferentiationInr(investmentDetail.current_val)}
                  </div>
                  <div className="iwd-hdcni-label">Current</div>
                </div>
                <div className="iwd-hdcn-item-divider"></div>
                <div className="iwd-hdcn-item">
                  <div className="iwd-hdcni-value">
                    {numDifferentiationInr(investmentDetail.invested_val)}
                  </div>
                  <div className="iwd-hdcni-label">Invested</div>
                </div>
                <div className="iwd-hdcn-item-divider"></div>
                <div className="iwd-hdcn-item" style={{ display: 'flex' }}>
                  <img src={true ? positive : negative} alt="" />
                  <div>
                    <div className="iwd-hdcni-value">
                      {(investmentDetail.xirr ? investmentDetail.xirr + '%' : '--')}
                    </div>
                    <div className="iwd-hdcni-label">XIRR</div>
                  </div>
                </div>
              </div>
              <div className="iwd-hdc-stats">
                <div className="iwd-hdcs-item">
                  <div className="iwd-hdcsi-value">
                    {formattedDate(fundDetail.start_date, 'd m y')}
                  </div>
                  <div className="iwd-hdcsi-label">Launch date</div>
                </div>
                <div className="iwd-hdcs-item">
                  <div className="iwd-hdcsi-value">
                    {nonRoundingToFixed(fundDetail.one_year_return, 2)}%
              </div>
                  <div className="iwd-hdcsi-label">1 yr return</div>
                </div>
                <div className="iwd-hdcs-item">
                  <div className="iwd-hdcsi-value">
                    {nonRoundingToFixed(fundDetail.three_year_return, 2)}%
              </div>
                  <div className="iwd-hdcsi-label">3 yrs return</div>
                </div>
                <div className="iwd-hdcs-item">
                  <div className="iwd-hdcsi-value">
                    {nonRoundingToFixed(fundDetail.five_year_return, 2)}%
              </div>
                  <div className="iwd-hdcsi-label">5 yrs return</div>
                </div>
              </div>
            </div>
            <div className="iwd-hdc-transactions">
              <div className="iwd-card-header">Transactions</div>
              <div className="iwd-hdct-table-container">
                {isLoadingTransactions ?
                  <IwdCardLoader loadingText="Fetching transactions..." /> :
                  <FSTable
                    headersMap={transactionsHeaderMap}
                    serializeData={true}
                    data={transactions}
                    className="iwd-transactions-table"
                  />
                }
              </div>
            </div>
            {!isLoadingTransactions && (
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
            {isMobileView && <ScrollTopBtn containerIdentifier="iwd-holding-detail" />}
          </div>
          <picture>
            <source srcSet={`${bg_waves_small} 1x`} media="(max-width: 640px)" />
            <img
              className="iwd-hd-banner-img"
              srcSet={`${bg_waves_full} 2x`}
              alt="" />
          </picture>
        </>
      }
    </Dialog>
  );
};

export default HoldingDetail;