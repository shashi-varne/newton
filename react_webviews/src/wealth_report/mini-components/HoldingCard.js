import React, { useEffect, useState } from 'react';
import WrButton from '../common/Button';
import WrTable from './WrTable';
import { IconButton } from '@material-ui/core';
import { numDifferentiationInr, formattedDate } from '../../utils/validators';

export default function HoldingCard(props) {
  const [expanded, expandCard] = useState(false);
  const [tabSelected, selectTab] = useState('fund');
  const { fund_summary = {}, ...holding = {} } = props.holding;
  
  const renderFundDetails = () => (
    <div id="wr-hce-fund-details">
      <div>
        <span className="wr-small-col-val">{formattedDate(fund_summary.fund_start_date, 'd m y')}</span>
        <span className="wr-small-col-title">Launch Date</span>
      </div>
      <div>
        <span className="wr-small-col-val">{numDifferentiationInr(fund_summary.aum)}</span>
        <span className="wr-small-col-title">AUM</span>
      </div>
      <div>
        <span className="wr-small-col-val">{numDifferentiationInr(fund_summary.one_year_return)}</span>
        <span className="wr-small-col-title">1 Year Return</span>
      </div>
      <div id="wr-hce-space"></div> {/*This div is required to create space for mobile view*/}
      <div>
        <span className="wr-small-col-val">{numDifferentiationInr(fund_summary.three_year_return)}</span>
        <span className="wr-small-col-title">3 Year Return</span>
      </div>
      <div>
        <span className="wr-small-col-val">{numDifferentiationInr(fund_summary.five_year_return)}</span>
        <span className="wr-small-col-title">5 Year Return</span>
      </div>
    </div>
  );

  const renderPastTransactions = () => (
    <div className="wr-hce-past-trx wr-table-container">
      <WrTable></WrTable>
    </div>
  );

  const AMCDetail = () => (
    <div className="wr-hc-amc-detail">
      <img className="amc-logo" src={require('assets/fisdom/ic-investment-strategy.svg')} alt="amc-logo" />
      <div className="wr-amc-detail">
        <div className="amc-detail-title">{holding.fund_name}</div>
        <div className="amc-detail-subtitle">{holding.scheme_type} · Since {formattedDate(holding.investment_since, 'm y')}</div>
        {/* // visbility will be modified based on the condition */}
        {holding.free_from_el_lockin && <div className="wr-EL-label">Free from EL / Lock-in</div>}
      </div>
      {FisdomRating(holding.fisdom_rating)}
    </div>
  );

  return (
    <div className="wr-card-template">
      {/* based on the condition visbility is modified */}
      <div className="wr-amc-label">
        <img src={require('assets/fisdom/label.svg')} alt="amc-logo" id="wr-amc-img" />
      </div>
      <div className="wr-holding-card">
        {AMCDetail()}
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
            <IconButton classes={{ root: 'wr-icon-button' }} color="inherit" aria-label="Menu" onClick={() => expandCard(!expanded)}>
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

const FisdomRating = (rating = 0) => {
  rating = parseInt(rating, 10);
  if (rating === 0) {
    return (<div
      className="wr-fisdom-rating"
      style={{ background: 'rgba(129, 129, 129, 0.08)' }}>
      <span
        className="rating-num"
        style={{ color: 'rgba(129, 129, 129, 0.5)' }}>
        --
      </span>
    </div>);
  }

  return (
    <div
      className="wr-fisdom-rating"
      style={{
        background: rating < 4 ? 'rgba(208,2,27,0.1)' : 'rgba(86,174,98,0.1)'
      }}>
      <span
        className="rating-num"
        style={{ color: rating < 4 ? '#d0021b' : '#56ae62' }}>
        {rating}
      </span>
      <img
        alt="star"
        src={require(`assets/ic-star-${rating < 4 ? 'red' : 'green'}.svg`)}
        className="rating-star"
      />
    </div>
  );
}