import React, { Component } from 'react';
import WrButton from '../common/Button';
import WrTable from './WrTable';

export default class HoldingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabSelected: 'fund',
      expanded: false,
    };
  }

  renderFundDetails = () => (
    <div id="wr-hce-fund-details">
      <div>
        <span className="wr-hc-col-val">10 Aug, 2016</span>
        <span className="wr-hc-col-title">Launch Date</span>
      </div>
      <div>
        <span className="wr-hc-col-val">₹ 1.2Cr </span>
        <span className="wr-hc-col-title">AUM</span>
      </div>
      <div>
        <span className="wr-hc-col-val">₹ 1.6L</span>
        <span className="wr-hc-col-title">1 Year Return</span>
      </div>
      <div>
        <span className="wr-hc-col-val">₹ 4.5L</span>
        <span className="wr-hc-col-title">3 Year Return</span>
      </div>
      <div>
        <span className="wr-hc-col-val">₹ 6.7L</span>
        <span className="wr-hc-col-title">5 Year Return</span>
      </div>
    </div>
  );

  renderPastTransactions = () => (
    <div id="wr-hce-past-trx">
      <WrTable></WrTable>
    </div>
  );

  render() {
    const { tabSelected, expanded } = this.state;

    return (
      <div className="wr-card-template">
        <div className="wr-holding-card">
          {AMCDetail()}
          <div className="wr-hc-col">
            <span className="wr-hc-col-val">₹ 10.3L</span>
            <span className="wr-hc-col-title">Invested Amount</span>
          </div>
          <div className="wr-hc-col">
            <span className="wr-hc-col-val">₹ 12.5L</span>
            <span className="wr-hc-col-title">Current Value</span>
          </div>
          <div className="wr-hc-col">
            <span className="wr-hc-col-val">23%</span>
            <span className="wr-hc-col-title">IRR</span>
          </div>
          <div>
            <img
              src={require(`assets/fisdom/${expanded ? 'down_arrow_fisdom' : 'ic-right-chevron' }.svg`)}
              alt="expand"
              onClick={() => this.setState({ expanded: !this.state.expanded })}
              style={{ cursor: 'pointer' }}/>
          </div>
        </div>
        {expanded ? 
          (<div className="wr-holding-card-expand">
            {[
              {tabName: 'fund', label: 'Fund Holdings'},
              {tabName: 'transactions', label: 'Transactions'},
             ].map(({ tabName, label }) => (
              <WrButton
                classes={{
                  root: tabSelected === tabName ? '' : 'wr-outlined-btn'
                }}
                style={{ marginRight: '16px' }}
                onClick={() => this.setState({ tabSelected: tabName })}
                disableRipple>
                {label}
              </WrButton>
              )
            )}
            <div className="wr-hce-fund-details">
              {tabSelected === 'fund' ?
                this.renderFundDetails() : this.renderPastTransactions()
              }
            </div>
          </div>) : ''
        }
      </div>
    );
  }
}

const AMCDetail = () => (
  <div className="wr-hc-amc-detail">
    <img className="amc-logo" src={require('assets/fisdom/ic-investment-strategy.svg')} alt="amc-logo"/>
    <div className="amc-detail-title">Axis Long Term Equity Gr {FisdomRating(4)}</div>
    <div className="amc-detail-subtitle">ELSS (Tax Savings) · Since Aug 2019</div>
  </div>
);

const FisdomRating = (rating) => (
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