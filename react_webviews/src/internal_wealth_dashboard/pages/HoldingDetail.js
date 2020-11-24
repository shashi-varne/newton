// ---------- Image Imports ------------
import fisdomIcon from 'assets/fisdom/fisdom_icon.svg';
import positive from 'assets/ic_positive.svg';
import negative from 'assets/ic_negative.svg';
// -------------------------------------
import React, { useEffect, useState } from 'react';
import PageCloseBtn from '../mini-components/PageCloseBtn';
import { navigate as navigateFunc } from '../common/commonFunctions';
import { formattedDate, numDifferentiationInr } from 'utils/validators.js';
import toast from '../../common/ui/Toast';
import { getFundDetail, getTransactions } from '../common/ApiCalls';

const HoldingDetail = ({
  investmentDetail,
  isin,
  ...props
}) => {
  const navigate = navigateFunc.bind(props);
  const [fundDetail, setFundDetail] = useState({});
  const [transactions, setTransations] = useState([]);

  const fetchHoldingDetail = () => {
    try {
      const result = getFundDetail({ isin });
      setFundDetail(result.fund_attributes);
    } catch (e) {
      console.log(e);
      toast(e);
    }
  };

  const fetchTransactions = () => {
    try {
      const result = getTransactions({
        isin,
        page_size: 20,
      });
      setTransations(result.transactions);
    } catch (e) {
      console.log(e);
      toast(e);
    }
  };

  useEffect(() => {
    fetchHoldingDetail();
    fetchTransactions();
  }, []);

  return (
    <div id="iwd-holding-detail">
      <PageCloseBtn clickHandler={() => navigate('main/holdings')} />
      <div className="iwd-hd-header">
        <img src={fisdomIcon} alt="" />
        <div>
          <div className="iwd-hdh-title">Holdings</div>
          <div className="iwd-hdh-fund-name">
            {investmentDetail.name}
          </div>
        </div>
      </div>
      <div>stars</div>
      <div className="iwd-hd-type">
        <span className="iwd-hdt-invested">
          Since {formattedDate(investmentDetail.invested_since, 'm y')}
        </span>
        <span className="iwd-hdt-divider">|</span>
        <span className="iwd-hdt-scheme-type">
          {investmentDetail.scheme_type}
        </span>
      </div>
      <div className="iwd-hd-info-row">
        <div className="iwd-hd-numbers">
          <div className="iwd-hdn-item">
            <div className="iwd-hdni-value current-val">
              {numDifferentiationInr(investmentDetail.current_val)}
            </div>
            <div className="iwd-hdni-label">Current</div>
          </div>
          <div className="iwd-hdn-item-divider"></div>
          <div className="iwd-hdn-item">
            <div className="iwd-hdni-value">
              {numDifferentiationInr(investmentDetail.invested_val)}
            </div>
            <div className="iwd-hdni-label">Invested</div>
          </div>
          <div className="iwd-hdn-item-divider"></div>
          <div className="iwd-hdn-item" style={{ display: 'flex' }}>
            <img src={true ? positive : negative} alt="" />
            <div>
              <div className="iwd-hdni-value">
                {numDifferentiationInr(investmentDetail.xirr)}%
              </div>
              <div className="iwd-hdni-label">XIRR</div>
            </div>
          </div>
        </div>
        <div className="iwd-hd-stats">
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">
              {formattedDate(fundDetail.start_date, 'd m y')}
            </div>
            <div className="iwd-hdsi-label">Launch date</div>
          </div>
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">
              {fundDetail.one_year_return}%
            </div>
            <div className="iwd-hdsi-label">1 yr return</div>
          </div>
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">
              {fundDetail.three_year_return}%
            </div>
            <div className="iwd-hdsi-label">3 yrs return</div>
          </div>
          <div className="iwd-hds-item">
            <div className="iwd-hdsi-value">
              {fundDetail.five_year_return}%
            </div>
            <div className="iwd-hdsi-label">5 yrs return</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingDetail;